import React, { useState, useEffect, useRef } from 'react';
import { StartupProject } from './types';
import {
  listProjects,
  loadProject,
  saveProject,
  deleteProject,
  duplicateProject,
  getActiveProjectId,
  setActiveProjectId,
  saveVersion,
  importProject,
} from './services/storage';
import { analyzeStartupIdea } from './services/api';
import { Homepage } from './components/Homepage';
import { CreateIdeaWizard } from './components/CreateIdeaWizard';
import { AnalysisLoading } from './components/AnalysisLoading';
import { Navbar } from './components/Navbar';
import { Sidebar, WorkspaceTab } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { MyIdeaView } from './components/views/MyIdeaView';
import { CustomerView } from './components/views/CustomerView';
import { MarketView } from './components/views/MarketView';
import { CompetitorView } from './components/views/CompetitorView';
import { BusinessView } from './components/views/BusinessView';
import { ValidationView } from './components/views/ValidationView';
import { ReportView } from './components/views/ReportView';
import { SettingsView } from './components/views/SettingsView';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { VersionHistoryDrawer } from './components/VersionHistoryDrawer';
import { ProjectCompareModal } from './components/ProjectCompareModal';

export default function App() {
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [activeProjectId, setActiveId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'home' | 'wizard' | 'analyzing' | 'workspace'>('home');
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Modals & Drawers
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareProjectA, setCompareProjectA] = useState<StartupProject | undefined>(undefined);
  const [compareProjectB, setCompareProjectB] = useState<StartupProject | undefined>(undefined);

  // Analysis stages state
  interface StageItem {
    id: string;
    label: string;
    status: 'pending' | 'in_progress' | 'completed';
  }

  const [analysisStages, setAnalysisStages] = useState<StageItem[]>([
    { id: '1', label: 'Reading your idea', status: 'pending' },
    { id: '2', label: 'Understanding the problem', status: 'pending' },
    { id: '3', label: 'Analyzing customers', status: 'pending' },
    { id: '4', label: 'Researching the market', status: 'pending' },
    { id: '5', label: 'Reviewing competition', status: 'pending' },
    { id: '6', label: 'Preparing validation plan', status: 'pending' },
  ]);

  // Notice banner
  const [notice, setNotice] = useState<string | null>(null);

  // File input ref for project import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const loaded = listProjects();
    setProjects(loaded);

    const activeId = getActiveProjectId();
    if (activeId && loaded.some((p) => p.id === activeId)) {
      setActiveId(activeId);
      setViewState('workspace');
    } else if (loaded.length > 0) {
      setActiveId(loaded[0].id);
      setActiveProjectId(loaded[0].id);
      setViewState('workspace');
    } else {
      setViewState('home');
    }
  }, []);

  const currentProject = projects.find((p) => p.id === activeProjectId) || null;

  // Handle switching projects
  const handleSelectProject = (projectId: string) => {
    setActiveId(projectId);
    setActiveProjectId(projectId);
    setViewState('workspace');
    setActiveTab('dashboard');
  };

  // Start new project wizard
  const handleStartValidating = () => {
    setViewState('wizard');
  };

  // Run analysis pipeline
  const executeAnalysis = async (projectData: Partial<StartupProject>) => {
    setViewState('analyzing');

    const updateStage = (index: number, status: 'in_progress' | 'completed') => {
      setAnalysisStages((prev) =>
        prev.map((s, i) => (i === index ? { ...s, status } : s))
      );
    };

    // Staged progression
    updateStage(0, 'in_progress');
    await new Promise((r) => setTimeout(r, 600));
    updateStage(0, 'completed');
    updateStage(1, 'in_progress');
    await new Promise((r) => setTimeout(r, 700));
    updateStage(1, 'completed');
    updateStage(2, 'in_progress');

    let analyzedData: any = null;
    try {
      const response = await analyzeStartupIdea(projectData as StartupProject);
      if (response.success && response.data?.data) {
        analyzedData = response.data.data;
      }
    } catch (e) {
      console.warn('Backend analysis call fallback:', e);
    }

    updateStage(2, 'completed');
    updateStage(3, 'in_progress');
    await new Promise((r) => setTimeout(r, 600));
    updateStage(3, 'completed');
    updateStage(4, 'in_progress');
    await new Promise((r) => setTimeout(r, 600));
    updateStage(4, 'completed');
    updateStage(5, 'in_progress');
    await new Promise((r) => setTimeout(r, 500));
    updateStage(5, 'completed');

    // Build finalized project structure
    const fullProject: StartupProject = {
      id: projectData.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: projectData.name || projectData.idea?.startupName || 'Untitled Startup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAnalyzed: true,
      idea: projectData.idea!,
      problem: analyzedData?.problem || projectData.problem!,
      solution: projectData.solution!,
      customerAnalysis: analyzedData?.customerAnalysis
        ? {
            ...projectData.customerAnalysis!,
            ...analyzedData.customerAnalysis,
          }
        : projectData.customerAnalysis!,
      businessModel: projectData.businessModel!,
      marketAnalysis: analyzedData?.marketAnalysis
        ? {
            ...projectData.marketAnalysis!,
            ...analyzedData.marketAnalysis,
          }
        : projectData.marketAnalysis!,
      competitorAnalysis: analyzedData?.competitorAnalysis
        ? {
            ...projectData.competitorAnalysis!,
            ...analyzedData.competitorAnalysis,
          }
        : projectData.competitorAnalysis!,
      feasibilityAnalysis: analyzedData?.feasibilityAnalysis
        ? {
            areas: analyzedData.feasibilityAnalysis.areas || [],
            sourceType: 'AI ANALYSIS',
            updatedAt: new Date().toISOString(),
          }
        : projectData.feasibilityAnalysis!,
      swotAnalysis: analyzedData?.swotAnalysis
        ? {
            ...analyzedData.swotAnalysis,
            sourceType: 'AI ANALYSIS',
          }
        : projectData.swotAnalysis!,
      risks: analyzedData?.risks?.length ? analyzedData.risks : projectData.risks!,
      assumptions: analyzedData?.assumptions?.length
        ? analyzedData.assumptions
        : projectData.assumptions!,
      validationPlan: analyzedData?.validationPlan
        ? {
            experiments: analyzedData.validationPlan.experiments || projectData.validationPlan!.experiments,
            checklist: projectData.validationPlan!.checklist,
            recommendedActions: analyzedData.validationPlan.recommendedActions || projectData.validationPlan!.recommendedActions,
            sourceType: 'AI ANALYSIS',
          }
        : projectData.validationPlan!,
      mvpPlan: analyzedData?.mvpPlan
        ? {
            ...projectData.mvpPlan!,
            ...analyzedData.mvpPlan,
          }
        : projectData.mvpPlan!,
      gtmPlan: analyzedData?.gtmPlan
        ? {
            ...projectData.gtmPlan!,
            ...analyzedData.gtmPlan,
          }
        : projectData.gtmPlan!,
      evidence: projectData.evidence || [],
    };

    saveProject(fullProject);
    saveVersion(fullProject.id, 'Version 1', 'Initial Idea and Structured Analysis');

    const updatedProjects = listProjects();
    setProjects(updatedProjects);
    setActiveId(fullProject.id);
    setActiveProjectId(fullProject.id);
    setViewState('workspace');
    setActiveTab('dashboard');

    if (!analyzedData) {
      setNotice('AI analysis is currently unavailable. Using structured baseline template. Connect an AI provider in Settings to enhance.');
      setTimeout(() => setNotice(null), 8000);
    }
  };

  // Re-run analysis on current project
  const handleReAnalyzeCurrent = async () => {
    if (!currentProject) return;
    await executeAnalysis(currentProject);
  };

  // Update project in-place
  const handleUpdateProject = (updated: StartupProject) => {
    saveProject(updated);
    setProjects(listProjects());
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    const updated = listProjects();
    setProjects(updated);
    if (activeProjectId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setActiveProjectId(updated[0].id);
      } else {
        setActiveId(null);
        setActiveProjectId(null);
        setViewState('home');
      }
    }
  };

  // Duplicate project
  const handleDuplicateProject = (id: string) => {
    const dup = duplicateProject(id);
    if (dup) {
      setProjects(listProjects());
      handleSelectProject(dup.id);
    }
  };

  // Import JSON handler
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importProject(text);
        setProjects(listProjects());
        handleSelectProject(imported.id);
      } catch (err: any) {
        alert(err.message || 'Failed to import project JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Compare versions handler
  const handleCompareVersions = (v1: StartupProject, v2: StartupProject) => {
    setCompareProjectA(v1);
    setCompareProjectB(v2);
    setIsVersionsOpen(false);
    setIsCompareOpen(true);
  };

  // Reset all data handler
  const handleResetAllData = () => {
    setProjects([]);
    setActiveId(null);
    setViewState('home');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] flex flex-col">
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Global Notice Banner (if any) */}
      {notice && (
        <div className="bg-amber-500 text-white text-xs px-4 py-2 font-medium flex items-center justify-between z-50">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-white hover:text-amber-100 ml-4">
            ✕
          </button>
        </div>
      )}

      {/* VIEW 1: HOMEPAGE */}
      {viewState === 'home' && (
        <Homepage
          projects={projects}
          onStartValidating={handleStartValidating}
          onOpenProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onDuplicateProject={handleDuplicateProject}
          onImportClick={() => fileInputRef.current?.click()}
          onNavigateSection={(sectionId) => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* VIEW 2: CREATE IDEA WIZARD */}
      {viewState === 'wizard' && (
        <div className="min-h-screen bg-[#F7F9FC]">
          <CreateIdeaWizard
            onCancel={() => {
              if (projects.length > 0) {
                setViewState('workspace');
              } else {
                setViewState('home');
              }
            }}
            onSubmit={executeAnalysis}
          />
        </div>
      )}

      {/* VIEW 3: ANALYZING STATE */}
      {viewState === 'analyzing' && (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
          <AnalysisLoading stages={analysisStages} />
        </div>
      )}

      {/* VIEW 4: MAIN WORKSPACE */}
      {viewState === 'workspace' && currentProject && (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            projectName={currentProject.name}
            isMobileOpen={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Navbar */}
            <Navbar
              currentProject={currentProject}
              projects={projects}
              onSelectProject={handleSelectProject}
              onNewProject={handleStartValidating}
              onOpenAssistant={() => setIsAssistantOpen(true)}
              onOpenVersions={() => setIsVersionsOpen(true)}
              onOpenCompare={() => {
                setCompareProjectA(undefined);
                setCompareProjectB(undefined);
                setIsCompareOpen(true);
              }}
              onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
              onRunAnalysis={handleReAnalyzeCurrent}
              isAnalyzing={false}
            />

            {/* Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto">
              {activeTab === 'dashboard' && (
                <DashboardView
                  project={currentProject}
                  onNavigateTab={setActiveTab}
                  onRunAction={(_actId, category) => {
                    if (category.toLowerCase().includes('customer')) setActiveTab('customers');
                    else if (category.toLowerCase().includes('competition')) setActiveTab('competitors');
                    else if (category.toLowerCase().includes('business')) setActiveTab('business');
                    else setActiveTab('validation');
                  }}
                />
              )}

              {activeTab === 'my-idea' && (
                <MyIdeaView
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                  onReAnalyze={handleReAnalyzeCurrent}
                />
              )}

              {activeTab === 'customers' && (
                <CustomerView
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'market' && (
                <MarketView
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                  onNavigateSettings={() => setActiveTab('settings')}
                />
              )}

              {activeTab === 'competitors' && (
                <CompetitorView
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'business' && (
                <BusinessView project={currentProject} />
              )}

              {activeTab === 'validation' && (
                <ValidationView
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'report' && (
                <ReportView project={currentProject} />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  currentProject={currentProject}
                  onImportClick={() => fileInputRef.current?.click()}
                  onResetAllData={handleResetAllData}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Floating Modals and Drawers */}
      {currentProject && (
        <>
          <AiAssistantDrawer
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            project={currentProject}
          />

          <VersionHistoryDrawer
            isOpen={isVersionsOpen}
            onClose={() => setIsVersionsOpen(false)}
            project={currentProject}
            onProjectRestored={(restored) => {
              handleUpdateProject(restored);
            }}
            onCompareVersions={handleCompareVersions}
          />

          <ProjectCompareModal
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            projects={projects}
            overrideProjectA={compareProjectA}
            overrideProjectB={compareProjectB}
          />
        </>
      )}
    </div>
  );
}
