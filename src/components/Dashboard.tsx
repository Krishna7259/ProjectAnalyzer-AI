import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  FolderPlus, 
  Activity, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  Layers,
  Cpu,
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import type { Project, DashboardStats, DifficultyLevel, ProjectStatus } from '../types/index.ts';

interface DashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProject }) => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageProgress: 0,
    totalMilestones: 0,
    completedMilestones: 0,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Input generator state
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('Artificial Intelligence & ML');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // Filtering state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const suggestedIdeas = [
    { title: 'AI Cyber Threat Detection', prompt: 'An AI-based cybersecurity threat detection website using machine learning for real-time anomalous packet traffic inspection.', domain: 'Cybersecurity', difficulty: 'Advanced' },
    { title: 'Smart Waste Management', prompt: 'An IoT and computer vision smart waste management and bin level monitoring system for modern cities.', domain: 'IoT & Smart Systems', difficulty: 'Intermediate' },
    { title: 'E-Commerce Website', prompt: 'A full-stack headless e-commerce store with real-time inventory management, stripe checkout, and recommendation engine.', domain: 'Web Development', difficulty: 'Intermediate' },
    { title: 'Virtual Try-On System', prompt: 'A web-based 3D virtual try-on system for clothes and eyewear using WebGL and computer vision pose estimation.', domain: 'Computer Vision', difficulty: 'Advanced' },
    { title: 'IoT Smart Agriculture', prompt: 'An automated IoT smart irrigation and soil nutrient telemetry platform with mobile dashboard for farmers.', domain: 'IoT & Smart Systems', difficulty: 'Beginner' },
    { title: 'College Management System', prompt: 'A comprehensive college ERP management platform with attendance tracking, gradebook, and course scheduling portal.', domain: 'Full-Stack Systems', difficulty: 'Intermediate' },
    { title: 'AI Resume Analyzer', prompt: 'An AI resume analyzer and job description matcher with ATS score feedback and missing skills recommendations.', domain: 'AI & Data Science', difficulty: 'Beginner' },
    { title: 'Online Learning Platform', prompt: 'An interactive online learning platform with coding sandboxes, milestone tracking, and video lecture progress.', domain: 'EdTech & Web', difficulty: 'Intermediate' },
  ];

  const analysisStepsMessages = [
    'ProjectsAnalyzer AI is analyzing your project idea...',
    'Identifying technologies and required skills...',
    'Preparing your development roadmap...',
    'Generating implementation milestones...',
    'Finalizing your project blueprint...',
  ];

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getProjects(),
      ]);
      setStats(statsRes);
      setProjects(projectsRes.projects);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAnalyzeProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim()) return;

    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalysisStep(0);

    // Step cycle animation for realistic UX feedback
    const interval = setInterval(() => {
      setAnalysisStep((prev) => (prev < analysisStepsMessages.length - 1 ? prev + 1 : prev));
    }, 1800);

    try {
      const { project } = await api.analyzeProject(projectIdea, selectedDomain, selectedDifficulty);
      clearInterval(interval);
      setAnalyzing(false);
      // Immediately open workspace
      onSelectProject(project.id);
    } catch (err: any) {
      clearInterval(interval);
      setAnalyzing(false);
      setAnalyzeError(err.message || 'Analysis failed. Please refine your idea and try again.');
    }
  };

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      await fetchDashboardData();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = domainFilter === 'All' || p.domain.toLowerCase().includes(domainFilter.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesDomain && matchesDifficulty && matchesStatus;
  });

  const uniqueDomains = Array.from(new Set(projects.map((p) => p.domain).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ProjectsAnalyzer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Developer'}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ready to analyze your next idea or continue building your projects?
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            fetchDashboardData();
          }}
          disabled={refreshing}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Workspace</span>
        </button>
      </div>

      {/* DASHBOARD STATISTICS: 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Projects */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Projects</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center border border-blue-500/20">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalProjects}</span>
            <span className="text-xs text-slate-500 font-medium">registered</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Across {uniqueDomains.length || 1} tech domain{uniqueDomains.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center border border-cyan-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-300">{stats.activeProjects}</span>
            <span className="text-xs text-slate-500 font-medium">in development</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {stats.totalMilestones - stats.completedMilestones} pending milestones
          </div>
        </div>

        {/* Completed Projects */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Projects</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{stats.completedProjects}</span>
            <span className="text-xs text-slate-500 font-medium">100% verified</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {stats.completedMilestones} milestones cleared
          </div>
        </div>

        {/* Average Progress */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Progress</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.averageProgress}%</span>
            <span className="text-xs text-slate-500 font-medium">overall</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.averageProgress}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* AI PROJECT GENERATOR SECTION */}
      <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Gemini AI Project Blueprint Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            What project would you like to analyze or build?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter any vision, problem statement, interest, or technology. ProjectsAnalyzer AI will generate an end-to-end 13-stage engineering blueprint, sequential roadmap, and milestone checklist.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyzeProject} className="mt-6 space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              required
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              placeholder="Describe your project idea, problem statement, interests, goals, or the technology you want to explore... (e.g. I want to build an AI-based cybersecurity threat detection website using machine learning)"
              className="w-full p-4 text-sm sm:text-base rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-inner transition-all resize-none"
            />
          </div>

          {/* Configuration Options */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Domain Preference */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Domain</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                  <option value="Mobile Applications">Mobile Applications (iOS/Android)</option>
                  <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                  <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                  <option value="Blockchain & Web3">Blockchain & Web3</option>
                  <option value="Data Science & Big Data">Data Science & Big Data</option>
                  <option value="Robotics & Autonomous Systems">Robotics & Autonomous Systems</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Complexity</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Beginner">Beginner (Foundations & Core Logic)</option>
                  <option value="Intermediate">Intermediate (Full-Stack & Database)</option>
                  <option value="Advanced">Advanced (Production Scale & Microservices)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={analyzing || !projectIdea.trim()}
              className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Analyze My Project</span>
            </button>
          </div>
        </form>

        {/* Error message */}
        {analyzeError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{analyzeError}</span>
            </div>
            <button
              type="button"
              onClick={handleAnalyzeProject}
              className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold shrink-0 transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        )}

        {/* Suggested Project Ideas Chips */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 mb-2.5">
            Click an example idea to populate:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedIdeas.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setProjectIdea(chip.prompt);
                  setSelectedDomain(chip.domain);
                  setSelectedDifficulty(chip.difficulty as DifficultyLevel);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left"
              >
                + {chip.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MY PROJECTS SECTION */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              My Projects
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review saved blueprints, track milestone checklists, and consult your AI mentor.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <FolderPlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {projects.length === 0
                ? 'You have not analyzed any project ideas yet. Use the generator above to create your first blueprint!'
                : 'No projects match your current search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const difficultyColors: Record<DifficultyLevel, string> = {
                Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                Intermediate: 'bg-blue-500/10 text-cyan-400 border-blue-500/20',
                Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              };

              const statusColors: Record<ProjectStatus, string> = {
                Planning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                'In Progress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
                Completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              };

              return (
                <div
                  key={project.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-slate-950/40"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${difficultyColors[project.difficulty]}`}>
                        {project.difficulty}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Title & Domain */}
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {project.domain}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Progress & Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-400">Milestone Progress</span>
                      <span className="text-white font-mono">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectProject(project.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-cyan-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Open Project</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProjectToDelete(project)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ANALYSIS PROGRESS OVERLAY MODAL */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] mx-auto mb-5 shadow-lg shadow-blue-500/20 animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-lg font-bold">Analyzing with Gemini AI</h3>
            <p className="text-xs text-cyan-300 mt-2 font-medium min-h-[36px] transition-all">
              {analysisStepsMessages[analysisStep]}
            </p>

            {/* Stepper indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {analysisStepsMessages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === analysisStep
                      ? 'w-6 bg-cyan-400'
                      : idx < analysisStep
                      ? 'w-2 bg-blue-600'
                      : 'w-2 bg-slate-800'
                  }`}
                ></div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 mt-4">
              Building architectural specifications, sequential roadmaps, and milestones...
            </p>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold">Delete Project?</h3>
            <p className="text-xs text-slate-400 mt-1">
              Are you sure you want to delete <strong className="text-white">"{projectToDelete.title}"</strong>? This will permanently remove its blueprint, milestone tracking, and AI mentor conversations.
            </p>

            {deleteError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {deleteError}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteProject}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
