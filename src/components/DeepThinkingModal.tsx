import React, { useState } from 'react';
import { X, BrainCircuit, Sparkles, Send, ShieldAlert, Cpu, Database, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api.ts';
import type { Project } from '../types/index.ts';

interface DeepThinkingModalProps {
  project: Project;
  onClose: () => void;
  onAnalysisUpdated?: (notes: string) => void;
}

export const DeepThinkingModal: React.FC<DeepThinkingModalProps> = ({ project, onClose, onAnalysisUpdated }) => {
  const [focusArea, setFocusArea] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>(project.deepAnalysisNotes || '');
  const [error, setError] = useState<string | null>(null);

  const presetQueries = [
    'Concurrency & Memory Bottlenecks in high-throughput traffic',
    'Comprehensive OWASP Top 10 Security & API Token Lifecycle Audit',
    'Database Sharding & Query Optimization for 100K+ daily active users',
    'Circuit Breakers & Graceful Degradation during 3rd-party outage',
  ];

  const handleRunAnalysis = async (query?: string) => {
    const targetQuery = query || focusArea || 'Full architectural audit, security threat model, and edge-case stress test';
    setLoading(true);
    setError(null);

    try {
      const res = await api.runDeepThinking(project.id, targetQuery);
      setAnalysisResult(res.analysis);
      if (onAnalysisUpdated) onAnalysisUpdated(res.analysis);
    } catch (err: any) {
      setError(err.message || 'Deep thinking analysis encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">High-Thinking Architectural Audit</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-3.1-pro-preview • HIGH REASONING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Auditing {project.title} with maximum reasoning depth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Query Bar */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Audit Focus or Complex Query
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Test edge cases around offline sync and token expiration..."
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleRunAnalysis()}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Run Thinking Audit</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetQueries.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFocusArea(preset);
                    handleRunAnalysis(preset);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-purple-300 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Result view */}
          {loading ? (
            <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800">
              <BrainCircuit className="w-12 h-12 text-purple-400 mx-auto animate-pulse mb-3" />
              <h3 className="text-sm font-bold text-white">Engaging High-Level Thinking Engine</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Gemini 3.1 Pro is systematically evaluating distributed bottlenecks, security vulnerabilities, and fault-tolerance edge cases...
              </p>
            </div>
          ) : analysisResult ? (
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Reasoning Audit Output
                </span>
                <span className="text-[11px] text-slate-400 font-mono">ThinkingLevel.HIGH</span>
              </div>
              <div className="prose prose-invert prose-xs max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                {analysisResult}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-950/30 border border-dashed border-slate-800 text-slate-500 text-xs">
              Click "Run Thinking Audit" or select one of the architectural presets above to evaluate your system with deep reasoning.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
