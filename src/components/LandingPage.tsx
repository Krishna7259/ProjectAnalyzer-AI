import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  BrainCircuit, 
  Map, 
  Cpu, 
  CheckCircle2, 
  Bot, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Terminal, 
  ChevronRight, 
  BarChart3, 
  ShieldCheck, 
  Zap,
  Code2,
  Workflow
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingPageProps {
  onStartAnalyzing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalyzing }) => {
  const { user, openAuthModal, demoLogin } = useAuth();

  const handlePrimaryClick = () => {
    if (user) {
      onStartAnalyzing();
    } else {
      openAuthModal('register');
    }
  };

  const domainChips = [
    'AI & Machine Learning',
    'Cybersecurity Threat Detection',
    'Full-Stack Web Dev',
    'Mobile Applications',
    'IoT Smart Hardware',
    'Cloud Computing & DevOps',
    'Blockchain & Web3',
    'Data Science & Analytics',
    'Robotics & Automation',
  ];

  const features = [
    {
      title: 'AI Project Analysis',
      desc: 'Gemini AI evaluates technical feasibility, implementation complexity, required resources, and assumptions for any idea.',
      icon: BrainCircuit,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'Intelligent Project Blueprint Generation',
      desc: 'Receive comprehensive 13-dimension architectural specifications, problem statements, and real-world application vectors.',
      icon: Layers,
      color: 'from-cyan-500 to-teal-400',
    },
    {
      title: 'Personalized Learning Roadmaps',
      desc: 'Sequential, theory-to-practice curricula designed to build prerequisite skills and programming concepts step-by-step.',
      icon: Map,
      color: 'from-indigo-500 to-blue-400',
    },
    {
      title: 'Technology Recommendations',
      desc: 'Precision stack suggestions for frontend, backend, database, APIs, and ML models with thorough architectural rationale.',
      icon: Cpu,
      color: 'from-violet-500 to-indigo-400',
    },
    {
      title: 'Interactive Milestone Tracking',
      desc: 'Dynamic checklists with instant progress recalculation, deliverable verification, and persistent completion history.',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'AI Project Mentor',
      desc: 'Context-aware conversational companion with deep understanding of your codebase, architecture, and current milestone.',
      icon: Bot,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Challenges and Solutions',
      desc: 'Anticipate complex engineering roadblocks before coding, with recommended mitigation techniques and fallbacks.',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-400',
    },
    {
      title: 'Documentation & Presentation Guidance',
      desc: 'Production-ready README templates, defense slide scripts, live demo preparation checklists, and PDF export.',
      icon: FileText,
      color: 'from-pink-500 to-rose-400',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe your project idea',
      desc: 'Enter any vision, problem statement, interest, or target technology stack you want to explore.',
    },
    {
      number: '02',
      title: 'Gemini AI analyzes the requirements',
      desc: 'Our multi-stage AI evaluates architectural feasibility, difficulty levels, and domain complexities.',
    },
    {
      number: '03',
      title: 'Receive a detailed project blueprint',
      desc: 'Get a full engineering specification, stack breakdown, system diagram, and required competencies.',
    },
    {
      number: '04',
      title: 'Follow milestones and learning roadmaps',
      desc: 'Work through sequentially ordered, practical development steps with clear deliverable milestones.',
    },
    {
      number: '05',
      title: 'Get help from the AI mentor',
      desc: 'Ask your project-aware AI mentor for debugging help, architecture explanations, and syntax hints.',
    },
    {
      number: '06',
      title: 'Complete your project & track progress',
      desc: 'Reach 100% completion, export your comprehensive defense documentation, and deploy to production.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background Gradients & Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-semibold text-cyan-400 shadow-xl shadow-cyan-950/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Engineering Roadmap Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400 font-normal">Powered by Google Gemini</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              Transform Your Project Ideas Into Reality With{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              <strong className="text-white font-semibold">ProjectsAnalyzer AI</strong> analyzes your ideas, creates personalized development roadmaps, recommends the right technologies, and guides you from concept to completion.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Analyzing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Features</span>
              </a>

              {!user && (
                <button
                  onClick={() => demoLogin()}
                  className="w-full sm:w-auto px-5 py-4 rounded-xl font-semibold text-xs sm:text-sm text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/60 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instant 1-Click Demo</span>
                </button>
              )}
            </div>

            {/* Domain Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Supported Domains:</span>
              {domainChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Mock Dashboard / Cockpit Teaser */}
          <div className="mt-16 sm:mt-20 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 blur-xl opacity-75"></div>
            
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Fake Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-xs font-mono text-slate-400">ProjectsAnalyzer Workspace • Preview</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  LIVE AI COCKPIT
                </div>
              </div>

              {/* Teaser Preview Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Project Blueprint Card */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                        Cybersecurity • Advanced
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Feasibility: 92/100</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">AI Cyber Threat Detection & Packet Analyzer</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Real-time packet inspection engine leveraging transformer models to identify zero-day intrusion signatures and anomalous network payloads.
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-300">
                      <span>Milestones Completed</span>
                      <span className="text-cyan-400 font-bold">5 of 6 (83%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 w-[83%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Milestones sample */}
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Milestone 1: Network Ingestion Pipeline</p>
                          <p className="text-[11px] text-slate-400">PCAP capture using libpcap & raw sockets</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Done</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/40 border border-blue-500/30 bg-blue-500/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-cyan-200">Milestone 2: Machine Learning Inference Core</p>
                          <p className="text-[11px] text-slate-400">Quantized ONNX model integration with sub-10ms latency</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider animate-pulse">In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI Mentor Chat Snippet */}
                <div className="lg:col-span-5 rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">ProjectsAnalyzer AI Mentor</p>
                        <p className="text-[10px] text-slate-400">Contextual Senior Architect</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2.5 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-xl rounded-br-none max-w-[90%] ml-auto border border-slate-800 text-slate-200">
                        How should I optimize the packet buffer without dropping frames during high burst traffic?
                      </div>
                      <div className="bg-blue-950/40 border border-blue-500/20 p-2.5 rounded-xl rounded-tl-none max-w-[95%] text-slate-300">
                        <p className="font-semibold text-cyan-300 mb-1">Recommended Approach:</p>
                        Use a lock-free circular ring buffer (e.g. DPDK or Tokio mpsc) paired with memory-mapped files. This decouples packet capture from inference threads!
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value="Ask AI Mentor anything about your project..." 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                    <button 
                      onClick={handlePrimaryClick} 
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors shrink-0"
                    >
                      Try Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered For Complete Project Mastery
            </p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Everything you need to conceptualize, design, implement, troubleshoot, and defend high-impact engineering projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} p-[1px] mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Idea To Shipped Project in 6 Steps
            </p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              A structured lifecycle that keeps you organized, technically grounded, and continuously moving forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="relative rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 hover:border-blue-500/40 transition-colors"
              >
                <div className="text-3xl font-black text-slate-700/60 font-mono mb-3">{step.number}</div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/60 to-slate-950/80 border border-blue-500/30 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to analyze your next project idea?
              </h3>
              <p className="mt-3 text-slate-300 text-sm">
                Join students, developers, researchers, and hackathon competitors building faster with ProjectsAnalyzer AI.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handlePrimaryClick}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-blue-500/25 transition-all"
                >
                  Get Started For Free
                </button>
                {!user && (
                  <button
                    onClick={() => demoLogin()}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-slate-900 border border-slate-700 hover:text-white transition-all"
                  >
                    Try Instant Demo
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <span className="font-bold text-sm text-white">ProjectsAnalyzer AI</span>
          </div>
          
          <p className="text-xs text-slate-500">
            © 2026 ProjectsAnalyzer AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <button onClick={handlePrimaryClick} className="hover:text-white transition-colors">Dashboard</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
