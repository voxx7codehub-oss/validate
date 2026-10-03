import React from 'react';
import {
  Menu,
  MessageSquare,
  History,
  GitCompare,
  Plus,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { StartupProject } from '../types';

interface NavbarProps {
  currentProject: StartupProject;
  projects: StartupProject[];
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onOpenAssistant: () => void;
  onOpenVersions: () => void;
  onOpenCompare: () => void;
  onToggleMobileNav: () => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  onOpenAssistant,
  onOpenVersions,
  onOpenCompare,
  onToggleMobileNav,
  onRunAnalysis,
  isAnalyzing,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-4 sm:px-6">
      {/* Zone 1: Mobile menu toggle + Project Breadcrumb / Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors py-1 px-2 rounded-md hover:bg-slate-50 border border-slate-200"
          >
            <span className="truncate max-w-[160px] sm:max-w-[220px]">
              {currentProject.name || 'Untitled Startup'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isSwitcherOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Project
              </div>
              <div className="max-h-60 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setIsSwitcherOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      p.id === currentProject.id
                        ? 'font-semibold text-blue-600 bg-blue-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.name || 'Untitled'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    onNewProject();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Workspace Utilities (Snapshots, Compare) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenVersions}
          title="Version History & Snapshots"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        >
          <History className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Versions</span>
        </button>

        {projects.length > 1 && (
          <button
            onClick={onOpenCompare}
            title="Compare Projects"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Compare</span>
          </button>
        )}
      </div>

      {/* Zone 3: Primary Actions (Ask VALIDATEAI, Re-Analyze) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAssistant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask VALIDATEAI</span>
        </button>

        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Re-Analyze</span>
        </button>
      </div>
    </header>
  );
};
