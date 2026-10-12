import React, { useState } from 'react';
import { X, Sparkles, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, setAuthModalMode, login, register, demoLogin } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else if (authModalMode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await register(name, email, password);
      } else if (authModalMode === 'forgot') {
        const res = await api.forgotPassword(email, password);
        setSuccessMessage(res.message);
        setTimeout(() => {
          setAuthModalMode('login');
          setSuccessMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
    } catch (err: any) {
      setError(err.message || 'Failed to start demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-[1px] mb-3 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {authModalMode === 'login' && 'Sign in to ProjectsAnalyzer AI'}
            {authModalMode === 'register' && 'Create Your Developer Account'}
            {authModalMode === 'forgot' && 'Reset Account Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login' && 'Access your personalized project blueprints & AI mentor.'}
            {authModalMode === 'register' && 'Transform your ideas into structured engineering roadmaps.'}
            {authModalMode === 'forgot' && 'Enter your email and choose a new password.'}
          </p>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Fast 1-Click Demo Login Button */}
        {authModalMode !== 'forgot' && (
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Continue with Instant Demo Developer</span>
          </button>
        )}

        {authModalMode !== 'forgot' && (
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-slate-900 text-slate-500 font-medium">Or enter credentials</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Hunter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                {authModalMode === 'forgot' ? 'New Password' : 'Password'}
              </label>
              {authModalMode === 'login' && (
                <button
                  type="button"
                  onClick={() => setAuthModalMode('forgot')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>
                  {authModalMode === 'login' && 'Sign In'}
                  {authModalMode === 'register' && 'Create Account'}
                  {authModalMode === 'forgot' && 'Reset Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Modal Footer Toggle */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="font-semibold text-cyan-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="font-semibold text-cyan-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
