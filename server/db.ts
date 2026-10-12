import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { User, Project, Milestone, ChatMessage, DashboardStats, ProjectBlueprint } from '../src/types/index.ts';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'projects_analyzer_db.json');

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  projects: Project[];
  milestones: Milestone[];
  chatMessages: ChatMessage[];
  sessions: { token: string; userId: string; expiresAt: string }[];
}

function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialData: DatabaseSchema = {
      users: [],
      projects: [],
      milestones: [],
      chatMessages: [],
      sessions: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB, resetting to clean state:', err);
    const initialData: DatabaseSchema = {
      users: [],
      projects: [],
      milestones: [],
      chatMessages: [],
      sessions: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to database:', err);
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export class Database {
  private static read(): DatabaseSchema {
    return ensureDbExists();
  }

  private static write(data: DatabaseSchema): void {
    saveDb(data);
  }

  // Auth & Users
  public static createUser(name: string, email: string, password: string): { user: User; token: string } {
    const db = this.read();
    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.users.find(u => u.email === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const id = 'usr_' + crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const storedUser: StoredUser = {
      id,
      name: name.trim(),
      email: normalizedEmail,
      createdAt,
      passwordHash,
      salt
    };

    db.users.push(storedUser);

    const token = 'tok_' + crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    this.write(db);

    const { passwordHash: _, salt: __, ...user } = storedUser;
    return { user, token };
  }

  public static loginUser(email: string, password: string): { user: User; token: string } {
    const db = this.read();
    const normalizedEmail = email.toLowerCase().trim();
    const storedUser = db.users.find(u => u.email === normalizedEmail);
    if (!storedUser) {
      throw new Error('Invalid email or password.');
    }

    const checkHash = hashPassword(password, storedUser.salt);
    if (checkHash !== storedUser.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const token = 'tok_' + crypto.randomBytes(32).toString('hex');
    db.sessions.push({
      token,
      userId: storedUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    this.write(db);

    const { passwordHash: _, salt: __, ...user } = storedUser;
    return { user, token };
  }

  public static getUserByToken(token: string): User | null {
    if (!token) return null;
    const db = this.read();
    const session = db.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      // Session expired
      db.sessions = db.sessions.filter(s => s.token !== token);
      this.write(db);
      return null;
    }

    const storedUser = db.users.find(u => u.id === session.userId);
    if (!storedUser) return null;

    const { passwordHash: _, salt: __, ...user } = storedUser;
    return user;
  }

  public static logout(token: string): void {
    const db = this.read();
    db.sessions = db.sessions.filter(s => s.token !== token);
    this.write(db);
  }

  public static resetPassword(email: string, newPassword: string): void {
    const db = this.read();
    const normalizedEmail = email.toLowerCase().trim();
    const storedUser = db.users.find(u => u.email === normalizedEmail);
    if (!storedUser) {
      throw new Error('No user found with this email.');
    }

    storedUser.salt = crypto.randomBytes(16).toString('hex');
    storedUser.passwordHash = hashPassword(newPassword, storedUser.salt);
    this.write(db);
  }

  public static seedDemoProjectsIfEmpty(userId: string): void {
    const db = this.read();
    const existing = db.projects.filter(p => p.userId === userId);
    if (existing.length > 0) return;

    const demoBlueprint: ProjectBlueprint = {
      title: 'AI Cyber Threat Detection & Packet Analyzer',
      domain: 'Cybersecurity',
      category: 'Network Security & Intrusion Detection System',
      difficulty: 'Advanced',
      overview: 'Real-time packet inspection engine leveraging deep learning transformers to identify zero-day intrusion signatures, distributed DDoS anomalous payload patterns, and unauthorized network telemetry.',
      estimatedDuration: '6-8 weeks (60 hours)',
      problemStatement: {
        existingProblem: 'Traditional signature-based firewalls and rule-based Snort systems fail to detect mutated polymorphic zero-day attacks and encrypted payload anomalies.',
        whyItMatters: 'Enterprise networks face over 30,000 automated probe attacks daily, risking data exfiltration, ransomware hijacking, and service downtime.',
        proposedSolution: 'A dual-engine neural inspection platform combining eBPF kernel packet capture with lightweight ONNX transformer classification to detect anomalies in sub-10ms intervals.',
        realWorldApplications: [
          'Enterprise Perimeter Firewalls & Cloud VPC Protection',
          'Financial High-Frequency Trading Network Audits',
          'Healthcare HIPAA Medical Device Telemetry Defense',
          'Industrial IoT SCADA Network Boundary Monitoring'
        ]
      },
      objectives: {
        mainObjective: 'Build a production-ready neural intrusion detection pipeline capable of streaming network packet analysis.',
        specificObjectives: [
          'Capture high-throughput network packets using eBPF or libpcap without frame dropping',
          'Extract 42 statistical flow features (entropy, packet inter-arrival time, window size)',
          'Deploy a quantized transformer model with 98.4% F1-score on benchmark PCAP corpora',
          'Build a real-time responsive threat cockpit with automated firewall rule isolation'
        ],
        expectedOutcomes: [
          'Sub-15ms packet latency per batch analysis',
          '99%+ precision on DDoS SYN-flood and SQL injection payloads',
          'Exportable defense audit logs compliant with MITRE ATT&CK matrix'
        ]
      },
      feasibility: {
        score: 92,
        technicalFeasibility: 'Highly feasible using modern kernel packet hooks and quantized ONNX runtime bindings.',
        implementationComplexity: 'Medium-High (requires kernel buffer tuning, vector tokenization, and web sockets).',
        requiredResources: [
          'Linux dev environment (Ubuntu 22.04 LTS)',
          'Promiscuous network interface or virtual TUN/TAP adapter',
          'Python 3.11 with PyTorch/ONNX Runtime & Node.js WebSocket gateway'
        ],
        majorAssumptions: [
          'Kernel has eBPF or libpcap privileges enabled',
          'Sufficient CPU allocation for concurrent ring buffer reads'
        ],
        expectedChallenges: [
          'Buffer ring overflow under extreme packet saturation (10Gbps burst)',
          'Encrypted TLS payload opacity requiring statistical flow metadata heuristics'
        ]
      },
      technologies: [
        { name: 'TypeScript / React', category: 'Frontend', reason: 'Reactive dashboard visualization with real-time WebSocket state updating' },
        { name: 'Node.js & Express', category: 'Backend', reason: 'High concurrency async event loop for telemetry stream distribution' },
        { name: 'Python & ONNX Runtime', category: 'AI/ML', reason: 'Sub-millisecond inference latency with quantized neural weights' },
        { name: 'eBPF / libpcap', category: 'Tool', reason: 'Zero-copy kernel packet filtering directly from network device queues' },
        { name: 'PostgreSQL & TimescaleDB', category: 'Database', reason: 'Time-series optimized logging for millions of security events per day' },
        { name: 'Tailwind CSS', category: 'Frontend', reason: 'High-contrast dark telemetry theme with electric blue alert states' }
      ],
      requiredSkills: {
        programmingLanguages: ['TypeScript', 'Python', 'C / eBPF Bytecode'],
        frameworks: ['React', 'FastAPI / Express', 'Tailwind CSS'],
        coreConcepts: ['TCP/IP Stack', 'Circular Ring Buffers', 'Confusion Matrix Analysis', 'MITRE ATT&CK Matrix'],
        practicalSkills: ['Wireshark PCAP debugging', 'Docker compose orchestration', 'WebSocket telemetry streaming']
      },
      architecture: {
        pattern: 'Reactive Event-Driven Micro-Pipelines with Kernel eBPF Hook',
        description: 'Packets are ingested at the kernel boundary, passed into a lock-free user-space ring buffer, feature-extracted in Python, and streamed to the React Cockpit via WebSockets.',
        components: [
          { layer: 'Kernel Ingestion Layer', role: 'Zero-copy packet filtering and timestamping', technologies: ['eBPF / XDP', 'libpcap'] },
          { layer: 'Inference Engine', role: 'Feature extraction and quantized transformer classification', technologies: ['Python', 'ONNX Runtime', 'NumPy'] },
          { layer: 'Telemetry Gateway', role: 'Threat event alerting and persistent storage', technologies: ['Node.js', 'PostgreSQL', 'WebSockets'] },
          { layer: 'Operator Cockpit', role: 'Interactive visualization, threat filtering, and milestone review', technologies: ['React', 'Lucide Icons', 'Tailwind CSS'] }
        ],
        dataFlow: [
          '1. Raw network frame arrives at network interface card (NIC)',
          '2. eBPF filter captures headers and passes payload to ring buffer',
          '3. Feature extractor generates 42-dimensional flow vector',
          '4. ONNX model scores threat probability (0.0 to 1.0)',
          '5. If score > 0.85, event logged to DB and broadcast to UI cockpit'
        ]
      },
      learningRoadmap: [
        {
          stepNumber: 1,
          topic: 'Computer Networking & Protocol Internals',
          explanation: 'Grasp OSI 7-layer model, TCP 3-way handshakes, IP headers, and packet fragmentation.',
          learningObjectives: ['Understand TCP flags (SYN, ACK, FIN, RST)', 'Inspect raw PCAPs in Wireshark'],
          suggestedPractice: 'Capture 50 packets using tcpdump and manually decode IP source and destination octets.',
          estimatedHours: '6 hours'
        },
        {
          stepNumber: 2,
          topic: 'Feature Engineering for Network Security',
          explanation: 'Transform raw byte sequences into numerical features: entropy, packet size variance, and inter-arrival timing.',
          learningObjectives: ['Compute Shannon entropy of payloads', 'Calculate rolling window metrics'],
          suggestedPractice: 'Write a Python script that calculates Shannon entropy of random text vs encrypted zip files.',
          estimatedHours: '8 hours'
        },
        {
          stepNumber: 3,
          topic: 'Machine Learning Classification for Anomaly Detection',
          explanation: 'Train decision trees and transformer models on the CIC-IDS2017 benchmark dataset.',
          learningObjectives: ['Avoid data leakage in time-series splits', 'Evaluate precision, recall, and ROC-AUC'],
          suggestedPractice: 'Train a RandomForestClassifier on network flow CSVs and export to ONNX format.',
          estimatedHours: '10 hours'
        },
        {
          stepNumber: 4,
          topic: 'High-Throughput WebSocket Streaming',
          explanation: 'Build asynchronous event pipelines that stream 100+ events/sec without UI stutter.',
          learningObjectives: ['Debounce high-frequency events', 'Manage WebSocket reconnect logic'],
          suggestedPractice: 'Create an Express WebSocket server streaming random security alerts to a React subscriber.',
          estimatedHours: '6 hours'
        }
      ],
      milestonesList: [
        {
          stepNumber: 1,
          title: 'Packet Ingestion & PCAP Parsing Core',
          description: 'Set up raw socket ingestion and parse Ethernet, IPv4, TCP, and UDP headers into structured objects.',
          tasks: ['Initialize network interface listener', 'Parse IP headers and port numbers', 'Unit test with sample PCAP files'],
          expectedDeliverable: 'Working packet reader CLI outputting structured JSON flow events'
        },
        {
          stepNumber: 2,
          title: 'Statistical Feature Extraction Pipeline',
          description: 'Extract 42 flow features including byte distribution entropy, inter-packet arrival time, and TCP flag anomalies.',
          tasks: ['Implement rolling 5-second window tracker', 'Calculate Shannon entropy on payloads', 'Export feature vectors to tensor format'],
          expectedDeliverable: 'Real-time vector generator operating under 2ms per packet'
        },
        {
          stepNumber: 3,
          title: 'ONNX Neural Inference Engine Integration',
          description: 'Load pre-trained quantized threat model and evaluate incoming feature vectors in real time.',
          tasks: ['Export PyTorch model to ONNX Int8', 'Benchmark inference latency', 'Calibrate classification threshold to 0.85'],
          expectedDeliverable: 'Sub-10ms inference pipeline with threat probability scoring'
        },
        {
          stepNumber: 4,
          title: 'Threat Event Dispatcher & Storage',
          description: 'Store anomalous events in PostgreSQL and publish alerts to connected client sessions via WebSockets.',
          tasks: ['Design security_events schema', 'Implement WebSocket broadcast channel', 'Add rate limiting and event aggregation'],
          expectedDeliverable: 'Working database persistence and real-time streaming endpoint'
        },
        {
          stepNumber: 5,
          title: 'Interactive Defense Dashboard & Telemetry UI',
          description: 'Build responsive React interface displaying live telemetry graphs, threat alerts, and drill-down inspection.',
          tasks: ['Create alert feed with severity tags', 'Build live packet volume chart', 'Add IP filtering and search'],
          expectedDeliverable: 'Production-ready dark cybernetic defense dashboard'
        },
        {
          stepNumber: 6,
          title: 'Comprehensive Security & MITRE ATT&CK Defense Audit',
          description: 'Perform stress-testing under simulated DDoS attacks, benchmark false positive rates, and prepare final documentation.',
          tasks: ['Replay DARPA/CIC-IDS attacks with tcpreplay', 'Validate zero frame-loss', 'Compile defense presentation slides'],
          expectedDeliverable: 'Final verified system, defense slides, and project report'
        }
      ],
      challenges: [
        {
          challenge: 'Packet Dropping Under High-Volume Traffic Spikes',
          impact: 'Can cause security systems to miss stealthy low-and-slow port scans or brute-force attempts.',
          recommendedSolution: 'Utilize Linux ring buffers (PACKET_MMAP) or eBPF kernel filters to avoid expensive context switching.'
        },
        {
          challenge: 'High False-Positive Alarm Fatigue',
          impact: 'Operators ignore critical alerts if regular TLS traffic triggers excessive false flags.',
          recommendedSolution: 'Incorporate behavioral baseline whitelisting and dynamic sliding-window thresholds rather than static rules.'
        }
      ],
      testingStrategy: {
        overview: 'Multi-stage test suite including mock packet replaying, fuzz testing, and stress benchmarking.',
        types: ['Unit Testing', 'PCAP Replay Testing', 'Latency Benchmarking', 'Fuzzing'],
        scenarios: [
          { scenario: 'Replay SYN-Flood PCAP attack', type: 'Functional', expectedOutcome: 'System detects DDoS with score > 0.95 within 100ms' },
          { scenario: 'Corrupted Ethernet frame with invalid CRC', type: 'Unit', expectedOutcome: 'Packet safely discarded without crashing ingestion thread' },
          { scenario: 'High packet volume (50,000 packets/sec)', type: 'UI', expectedOutcome: 'WebSocket throttles UI updates while DB records all critical events' }
        ]
      },
      documentationGuide: {
        readmeStructure: [
          'ProjectsAnalyzer AI - AI Cyber Threat Detection Blueprint',
          'System Architecture & eBPF Data Flow Diagram',
          'Hardware & Kernel Prerequisites',
          'Quickstart Installation (Docker & Native)',
          'Dataset Benchmarks & Confusion Matrix Results',
          'MITRE ATT&CK Mapping & API Reference'
        ],
        systemArchitectureNotes: 'Emphasize the decoupling between kernel packet capture and asynchronous neural inference.',
        modulesExplanation: ['src/ingestion: Raw socket & PCAP parser', 'src/inference: ONNX runtime integration', 'src/ui: React telemetry cockpit'],
        conclusionOutline: 'Demonstrated how ML transformers reduce false positives by 74% compared to legacy signature matching.'
      },
      presentationGuide: {
        targetAudience: 'University faculty, cybersecurity judges, and technical recruiters',
        slides: [
          { slideNumber: 1, title: 'Introduction & The Zero-Day Challenge', keyPoints: ['Why legacy firewalls fail', 'Rise of encrypted malicious payloads'], presentationTip: 'Open with a real-world statistic on recent ransomware breaches' },
          { slideNumber: 2, title: 'Proposed Neural Architecture', keyPoints: ['Zero-copy kernel capture', 'Lightweight ONNX transformer model'], presentationTip: 'Display the architectural data flow diagram clearly' },
          { slideNumber: 3, title: 'Live Demonstration', keyPoints: ['Live injection of SYN-flood', 'Real-time alert trigger under 15ms'], presentationTip: 'Have a pre-recorded backup video ready just in case' },
          { slideNumber: 4, title: 'Evaluation & Future Scope', keyPoints: ['98.4% detection rate', 'Hardware acceleration with FPGA/DPU'], presentationTip: 'Summarize actionable takeaways and production readiness' }
        ],
        demoChecklist: [
          'Verify local server is running',
          'Load sample attack PCAP into tcpreplay',
          'Open WebSocket dashboard in browser'
        ]
      },
      futureImprovements: [
        'Hardware acceleration using SmartNICs and DPDK',
        'Automated BGP blackholing to neutralize DDoS attacks at ISP level',
        'Federated learning across multiple enterprise nodes without sharing raw PCAP data'
      ]
    };

    const { project, milestones } = this.createProject(userId, demoBlueprint);

    // Mark milestones 1 & 2 as completed for realistic stats
    if (milestones[0]) {
      this.toggleMilestone(milestones[0].id, project.id, userId, true);
    }
    if (milestones[1]) {
      this.toggleMilestone(milestones[1].id, project.id, userId, true);
    }
  }

  // Projects
  public static getProjectsByUser(userId: string): Project[] {
    const db = this.read();
    return db.projects.filter(p => p.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public static getProjectById(projectId: string, userId: string): { project: Project; milestones: Milestone[]; chatMessages: ChatMessage[] } | null {
    const db = this.read();
    const project = db.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) return null;

    const milestones = db.milestones
      .filter(m => m.projectId === projectId)
      .sort((a, b) => a.stepNumber - b.stepNumber);

    const chatMessages = db.chatMessages
      .filter(c => c.projectId === projectId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { project, milestones, chatMessages };
  }

  public static createProject(userId: string, blueprint: ProjectBlueprint): { project: Project; milestones: Milestone[] } {
    const db = this.read();
    const projectId = 'prj_' + crypto.randomUUID();
    const now = new Date().toISOString();

    const milestones: Milestone[] = blueprint.milestonesList.map((m, index) => ({
      id: 'mls_' + crypto.randomUUID(),
      projectId,
      stepNumber: m.stepNumber || (index + 1),
      title: m.title,
      description: m.description,
      tasks: m.tasks || [],
      expectedDeliverable: m.expectedDeliverable || '',
      isCompleted: false,
      completedAt: null,
      createdAt: now
    }));

    const project: Project = {
      id: projectId,
      userId,
      title: blueprint.title,
      description: blueprint.overview,
      domain: blueprint.domain,
      difficulty: blueprint.difficulty,
      status: 'Planning',
      progress: 0,
      blueprint,
      createdAt: now,
      updatedAt: now
    };

    db.projects.push(project);
    db.milestones.push(...milestones);

    // Initial greeting in chat from AI mentor
    const greetingMessage: ChatMessage = {
      id: 'msg_' + crypto.randomUUID(),
      projectId,
      sender: 'assistant',
      message: `Hello! I am your **ProjectsAnalyzer AI Mentor** for **${project.title}**.\n\nI have reviewed your project blueprint across ${milestones.length} milestones and your target technology stack (${blueprint.technologies.map(t => t.name).slice(0, 4).join(', ')}).\n\nFeel free to ask me questions like:\n- *How should I start Milestone 1?*\n- *Can you explain the system architecture in detail?*\n- *Which tutorials or documentation should I read first?*\n\nLet's build something extraordinary together! What would you like help with today?`,
      createdAt: now
    };
    db.chatMessages.push(greetingMessage);

    this.write(db);
    return { project, milestones };
  }

  public static toggleMilestone(milestoneId: string, projectId: string, userId: string, isCompleted: boolean): { milestone: Milestone; project: Project } {
    const db = this.read();
    const project = db.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) throw new Error('Project not found or unauthorized.');

    const milestone = db.milestones.find(m => m.id === milestoneId && m.projectId === projectId);
    if (!milestone) throw new Error('Milestone not found.');

    milestone.isCompleted = isCompleted;
    milestone.completedAt = isCompleted ? new Date().toISOString() : null;

    // Recalculate progress
    const projectMilestones = db.milestones.filter(m => m.projectId === projectId);
    const total = projectMilestones.length;
    const completedCount = projectMilestones.filter(m => m.isCompleted).length;
    
    const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    project.progress = progress;
    project.updatedAt = new Date().toISOString();

    if (progress === 100) {
      project.status = 'Completed';
    } else if (progress > 0) {
      project.status = 'In Progress';
    } else {
      project.status = 'Planning';
    }

    this.write(db);
    return { milestone, project };
  }

  public static deleteProject(projectId: string, userId: string): void {
    const db = this.read();
    const projectIndex = db.projects.findIndex(p => p.id === projectId && p.userId === userId);
    if (projectIndex === -1) throw new Error('Project not found or unauthorized.');

    db.projects.splice(projectIndex, 1);
    db.milestones = db.milestones.filter(m => m.projectId !== projectId);
    db.chatMessages = db.chatMessages.filter(c => c.projectId !== projectId);

    this.write(db);
  }

  public static addChatMessage(projectId: string, userId: string, sender: 'user' | 'assistant', message: string, thinkingProcess?: string): ChatMessage {
    const db = this.read();
    const project = db.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) throw new Error('Project not found or unauthorized.');

    const newMsg: ChatMessage = {
      id: 'msg_' + crypto.randomUUID(),
      projectId,
      sender,
      message,
      createdAt: new Date().toISOString(),
      thinkingProcess
    };

    db.chatMessages.push(newMsg);
    this.write(db);
    return newMsg;
  }

  public static updateProjectMedia(projectId: string, userId: string, updates: { conceptImageUrl?: string; pitchVideoUrl?: string; deepAnalysisNotes?: string }): Project {
    const db = this.read();
    const project = db.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) throw new Error('Project not found or unauthorized.');

    if (updates.conceptImageUrl !== undefined) project.conceptImageUrl = updates.conceptImageUrl;
    if (updates.pitchVideoUrl !== undefined) project.pitchVideoUrl = updates.pitchVideoUrl;
    if (updates.deepAnalysisNotes !== undefined) project.deepAnalysisNotes = updates.deepAnalysisNotes;
    project.updatedAt = new Date().toISOString();

    this.write(db);
    return project;
  }

  public static getDashboardStats(userId: string): DashboardStats {
    const db = this.read();
    const userProjects = db.projects.filter(p => p.userId === userId);
    const totalProjects = userProjects.length;

    const activeProjects = userProjects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
    const completedProjects = userProjects.filter(p => p.status === 'Completed').length;

    let averageProgress = 0;
    if (totalProjects > 0) {
      const sumProgress = userProjects.reduce((acc, curr) => acc + (curr.progress || 0), 0);
      averageProgress = Math.round(sumProgress / totalProjects);
    }

    const userProjectIds = new Set(userProjects.map(p => p.id));
    const userMilestones = db.milestones.filter(m => userProjectIds.has(m.projectId));
    const totalMilestones = userMilestones.length;
    const completedMilestones = userMilestones.filter(m => m.isCompleted).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      averageProgress,
      totalMilestones,
      completedMilestones
    };
  }
}
