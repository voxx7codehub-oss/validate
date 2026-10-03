import React from 'react';
import {
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Users,
  Compass,
  Briefcase,
  CheckSquare,
  FileText,
  Settings,
  X,
} from 'lucide-react';

export type WorkspaceTab =
  | 'dashboard'
  | 'my-idea'
  | 'market'
  | 'customers'
  | 'competitors'
  | 'business'
  | 'validation'
  | 'report'
  | 'settings';

interface SidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  projectName: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  projectName,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: WorkspaceTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-idea', label: 'My Idea', icon: Lightbulb },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'market', label: 'Market', icon: TrendingUp },
    { id: 'competitors', label: 'Competitors', icon: Compass },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'validation', label: 'Validation', icon: CheckSquare },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Brand & Project indicator */}
      <div className="p-5 border-b border-slate-200">
        <div className="text-base font-bold text-slate-900 tracking-tight flex items-center justify-between">
          <span>
            VALIDATE<span className="text-blue-600">AI</span>
          </span>
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-600 truncate font-medium">
          {projectName || 'Untitled Project'}
        </div>
        <div className="text-[11px] text-slate-400">Startup Validation Workspace</div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (isMobileOpen) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Workspace Footer status note */}
      <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400">
        <div>Storage: Local Browser</div>
        <div className="text-slate-500 mt-0.5">Objective validation engine</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen">{content}</aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
