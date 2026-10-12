import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ProjectWorkspace } from './components/ProjectWorkspace.tsx';
import { AuthModal } from './components/AuthModal.tsx';

function MainLayout() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'workspace'>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Sync default view when user logs in / out
  React.useEffect(() => {
    if (user && currentView === 'landing') {
      setCurrentView('dashboard');
    } else if (!user && currentView !== 'landing') {
      setCurrentView('landing');
      setSelectedProjectId(null);
    }
  }, [user]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedProjectId(null);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'landing' | 'dashboard') => {
    setSelectedProjectId(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenNewProjectModal={() => {
          setSelectedProjectId(null);
          setCurrentView('dashboard');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onStartAnalyzing={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onSelectProject={handleSelectProject} />
        )}

        {currentView === 'workspace' && selectedProjectId && (
          <ProjectWorkspace
            projectId={selectedProjectId}
            onBack={handleBackToDashboard}
          />
        )}
      </main>

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
