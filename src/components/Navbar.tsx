import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  FolderGit2, 
  MessageSquareCode, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'workspace';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenNewProjectModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenNewProjectModal }) => {
  const { user, logout, openAuthModal, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  ProjectsAnalyzer
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
                Architect • Roadmaps • Mentorship
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Home
                </button>
                <a
                  href="#features"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  How It Works
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    if (onOpenNewProjectModal) onOpenNewProjectModal();
                  }}
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  Analyze Project
                </button>
              </>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button
                  onClick={() => demoLogin()}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 rounded-lg bg-slate-900/60 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Instant Demo
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="relative group overflow-hidden rounded-lg p-[1px] font-medium text-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-lg group-hover:opacity-90 transition-opacity"></span>
                  <span className="relative block px-4 py-2 rounded-lg bg-slate-950/80 group-hover:bg-slate-950/40 text-white font-semibold transition-colors flex items-center gap-1.5">
                    Get Started
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/70 hover:bg-slate-900 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="pr-1.5 hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</p>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-800/80">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                      ProjectsAnalyzer Workspace
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <button
                onClick={() => demoLogin()}
                className="px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700 rounded-lg bg-slate-900"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-3">
          {!user ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('landing');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Home
              </button>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                How It Works
              </a>
              <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('register');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-xl"
                >
                  Get Started Free
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 mb-2">
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('dashboard');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-cyan-300 bg-blue-600/20 border border-blue-500/30 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                ProjectsAnalyzer Workspace
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  onNavigate('landing');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
