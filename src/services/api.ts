import type { User, Project, Milestone, ChatMessage, DashboardStats, ProjectBlueprint } from '../types/index.ts';

const TOKEN_KEY = 'projectsanalyzer_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  demoLogin: () =>
    request<{ user: User; token: string }>('/api/auth/demo', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    request<{ user: User }>('/api/auth/me'),

  logout: () =>
    request<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    }),

  forgotPassword: (email: string, newPassword: string) =>
    request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    }),

  // Dashboard
  getDashboardStats: () =>
    request<DashboardStats>('/api/dashboard/stats'),

  // Projects
  getProjects: () =>
    request<{ projects: Project[] }>('/api/projects'),

  analyzeProject: (idea: string, domain?: string, difficulty?: string) =>
    request<{ project: Project; milestones: Milestone[] }>('/api/projects/analyze', {
      method: 'POST',
      body: JSON.stringify({ idea, domain, difficulty }),
    }),

  getProjectDetails: (id: string) =>
    request<{ project: Project; milestones: Milestone[]; chatMessages: ChatMessage[] }>(`/api/projects/${id}`),

  deleteProject: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  toggleMilestone: (projectId: string, milestoneId: string, isCompleted: boolean) =>
    request<{ milestone: Milestone; project: Project }>(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    }),

  // AI Mentor Chat
  sendMentorMessage: (projectId: string, message: string, modelMode: 'flash' | 'fast' | 'pro' = 'flash') =>
    request<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(`/api/projects/${projectId}/mentor`, {
      method: 'POST',
      body: JSON.stringify({ message, modelMode }),
    }),

  // Deep Thinking Mode (gemini-3.1-pro-preview with ThinkingLevel.HIGH)
  runDeepThinking: (projectId: string, focusArea?: string) =>
    request<{ analysis: string; thinkingProcess?: string }>(`/api/projects/${projectId}/deep-thinking`, {
      method: 'POST',
      body: JSON.stringify({ focusArea }),
    }),

  // AI Concept Art (gemini-3-pro-image-preview with 1K, 2K, 4K affordance)
  generateConceptImage: (projectId: string, imageSize: '1K' | '2K' | '4K', promptDescription?: string) =>
    request<{ imageUrl: string; project: Project }>(`/api/projects/${projectId}/generate-concept-image`, {
      method: 'POST',
      body: JSON.stringify({ imageSize, promptDescription }),
    }),

  // AI Pitch Video (veo-3.1-fast-generate-preview with 16:9 or 9:16)
  generatePitchVideo: (projectId: string, aspectRatio: '16:9' | '9:16') =>
    request<{ operationName?: string; status: string; videoUrl?: string }>(`/api/projects/${projectId}/generate-pitch-video`, {
      method: 'POST',
      body: JSON.stringify({ aspectRatio }),
    }),
};
