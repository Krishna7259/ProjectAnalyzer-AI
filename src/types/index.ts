export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface RoadmapStep {
  stepNumber: number;
  topic: string;
  explanation: string;
  learningObjectives: string[];
  suggestedPractice: string;
  estimatedHours?: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  stepNumber: number;
  title: string;
  description: string;
  tasks: string[];
  expectedDeliverable: string;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}

export interface TechnologyItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'API' | 'AI/ML' | 'Tool' | 'Deployment';
  reason: string;
  docsUrl?: string;
}

export interface ChallengeItem {
  challenge: string;
  impact: string;
  recommendedSolution: string;
}

export interface TestingScenario {
  scenario: string;
  type: 'Unit' | 'Integration' | 'Functional' | 'UI' | 'Security';
  expectedOutcome: string;
}

export interface ProjectBlueprint {
  title: string;
  domain: string;
  category: string;
  difficulty: DifficultyLevel;
  overview: string;
  estimatedDuration: string;
  
  problemStatement: {
    existingProblem: string;
    whyItMatters: string;
    proposedSolution: string;
    realWorldApplications: string[];
  };

  objectives: {
    mainObjective: string;
    specificObjectives: string[];
    expectedOutcomes: string[];
  };

  feasibility: {
    score: number; // 0 - 100
    technicalFeasibility: string;
    implementationComplexity: string;
    requiredResources: string[];
    majorAssumptions: string[];
    expectedChallenges: string[];
  };

  technologies: TechnologyItem[];

  requiredSkills: {
    programmingLanguages: string[];
    frameworks: string[];
    coreConcepts: string[];
    practicalSkills: string[];
  };

  architecture: {
    pattern: string;
    description: string;
    components: {
      layer: string;
      role: string;
      technologies: string[];
    }[];
    dataFlow: string[];
  };

  learningRoadmap: RoadmapStep[];
  
  milestonesList: {
    stepNumber: number;
    title: string;
    description: string;
    tasks: string[];
    expectedDeliverable: string;
  }[];

  challenges: ChallengeItem[];

  testingStrategy: {
    overview: string;
    types: string[];
    scenarios: TestingScenario[];
  };

  documentationGuide: {
    readmeStructure: string[];
    systemArchitectureNotes: string;
    modulesExplanation: string[];
    conclusionOutline: string;
  };

  presentationGuide: {
    targetAudience: string;
    slides: {
      slideNumber: number;
      title: string;
      keyPoints: string[];
      presentationTip: string;
    }[];
    demoChecklist: string[];
  };

  futureImprovements: string[];
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: string;
  difficulty: DifficultyLevel;
  status: ProjectStatus;
  progress: number; // 0 - 100
  blueprint: ProjectBlueprint;
  createdAt: string;
  updatedAt: string;
  conceptImageUrl?: string;
  pitchVideoUrl?: string;
  deepAnalysisNotes?: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  sender: 'user' | 'assistant';
  message: string;
  createdAt: string;
  thinkingProcess?: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  totalMilestones: number;
  completedMilestones: number;
}
