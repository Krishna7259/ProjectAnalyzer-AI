import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Download, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';
import { api } from '../services/api.ts';
import type { Project } from '../types/index.ts';

interface VisualStudioModalProps {
  project: Project;
  onClose: () => void;
  onImageUpdated?: (newUrl: string) => void;
}

export const VisualStudioModal: React.FC<VisualStudioModalProps> = ({ project, onClose, onImageUpdated }) => {
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string>(project.conceptImageUrl || '');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.generateConceptImage(project.id, imageSize, customPrompt);
      setGeneratedImage(res.imageUrl);
      if (onImageUpdated) onImageUpdated(res.imageUrl);
    } catch (err: any) {
      setError(err.message || 'Image generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">AI Concept Art & Architecture Studio</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate 16:9 architectural telemetry visuals for {project.title}
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
          
          {/* Controls: Resolution Affordance (1K, 2K, 4K) & Custom Prompt */}
          <div className="space-y-4 rounded-2xl bg-slate-950/60 border border-slate-800 p-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Resolution (Affordance Required: 1K, 2K, 4K)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      imageSize === size
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-md shadow-blue-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{size} Ultra HD</span>
                    {imageSize === size && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Visual Art Style / Specific Directives (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Glowing cybernetic network nodes, telemetry HUD overlays, dark navy theme..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all shrink-0 shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate {imageSize} Artwork</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Visual Canvas Display */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-2 overflow-hidden flex flex-col items-center justify-center min-h-[300px] relative">
            {loading ? (
              <div className="p-12 text-center">
                <ImageIcon className="w-12 h-12 text-cyan-400 mx-auto animate-bounce mb-3" />
                <h3 className="text-sm font-bold text-white">Rendering Concept Artwork ({imageSize})</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesizing high-resolution architectural concept art with gemini-3-pro-image-preview...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="w-full relative group">
                <img
                  src={generatedImage}
                  alt={project.title}
                  className="w-full h-auto max-h-[460px] object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <a
                    href={generatedImage}
                    download={`${project.title.toLowerCase().replace(/\s+/g, '_')}_concept_${imageSize}.png`}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download ({imageSize})</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                Click "Generate {imageSize} Artwork" above to create custom visual architecture artwork.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
