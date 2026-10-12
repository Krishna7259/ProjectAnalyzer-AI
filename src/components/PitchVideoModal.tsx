import React, { useState } from 'react';
import { X, Video, Sparkles, RefreshCw, CheckCircle, Play, Film } from 'lucide-react';
import { api } from '../services/api.ts';
import type { Project } from '../types/index.ts';

interface PitchVideoModalProps {
  project: Project;
  onClose: () => void;
  onVideoUpdated?: (videoUrl: string) => void;
}

export const PitchVideoModal: React.FC<PitchVideoModalProps> = ({ project, onClose, onVideoUpdated }) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>(project.pitchVideoUrl || '');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.generatePitchVideo(project.id, aspectRatio);
      if (res.videoUrl) {
        setVideoUrl(res.videoUrl);
        if (onVideoUpdated) onVideoUpdated(res.videoUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Video generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Video className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Veo 3 Pitch Video Teaser</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  veo-3.1-fast-generate-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate a showcase teaser trailer for {project.title}
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
          
          {/* Controls: Aspect Ratio (16:9 or 9:16) */}
          <div className="space-y-3 rounded-2xl bg-slate-950/60 border border-slate-800 p-5">
            <label className="block text-xs font-semibold text-slate-300">
              Aspect Ratio Format (Required: 16:9 Landscape or 9:16 Portrait)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  aspectRatio === '16:9'
                    ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white border-rose-400 shadow-md shadow-rose-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>16:9 Landscape (Desktop / Slides)</span>
                {aspectRatio === '16:9' && <CheckCircle className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  aspectRatio === '9:16'
                    ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white border-rose-400 shadow-md shadow-rose-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Film className="w-4 h-4 rotate-90" />
                <span>9:16 Portrait (Mobile / Reels)</span>
                {aspectRatio === '9:16' && <CheckCircle className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerateVideo}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate Video with Veo 3</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Video Preview */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-2 overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
            {loading ? (
              <div className="p-12 text-center">
                <Video className="w-12 h-12 text-rose-400 mx-auto animate-pulse mb-3" />
                <h3 className="text-sm font-bold text-white">Veo 3 Video Synthesis in Progress</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesizing a dynamic {aspectRatio} teaser video with camera flythrough and neon telemetry...
                </p>
              </div>
            ) : videoUrl ? (
              <div className={`w-full ${aspectRatio === '9:16' ? 'max-w-xs' : ''} rounded-xl overflow-hidden shadow-2xl`}>
                <video
                  controls
                  autoPlay
                  loop
                  muted
                  src={videoUrl}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500 text-xs">
                Select your aspect ratio and click "Generate Video with Veo 3" to create an AI product trailer.
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
