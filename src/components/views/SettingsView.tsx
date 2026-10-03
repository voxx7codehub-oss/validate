import React, { useState, useEffect } from 'react';
import { AppSettings, StartupProject } from '../../types';
import { loadSettings, saveSettings, clearLocalData, exportProject } from '../../services/storage';
import { fetchServerSettings } from '../../services/api';
import {
  Settings,
  Server,
  Database,
  Search,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface SettingsViewProps {
  currentProject: StartupProject;
  onImportClick: () => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentProject,
  onImportClick,
  onResetAllData,
}) => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl || '');
  const [isSaved, setIsSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setIsRefreshing(true);
    try {
      const serverInfo = await fetchServerSettings();
      if (serverInfo) {
        const updated = saveSettings(serverInfo);
        setSettings(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveSettings({ apiBaseUrl: apiBaseUrl.trim() });
    setSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportCurrent = () => {
    try {
      const json = exportProject(currentProject.id);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name || 'project'}_backup.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmClear = () => {
    clearLocalData();
    setShowClearConfirm(false);
    onResetAllData();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure integration endpoints, monitor provider status, and manage local backups.
          </p>
        </div>
        <button
          onClick={checkServer}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Integration Providers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <h2 className="text-base font-bold text-slate-900">Connected Services & Providers</h2>

        <div className="space-y-4">
          {/* AI Provider */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">AI Intelligence Provider</span>
                <span className="text-slate-500">
                  {settings.aiProviderConfigured
                    ? 'Connected — Gemini 3.8 Flash analysis active'
                    : 'Not Configured — Provide AI_API_KEY in environment'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {settings.aiProviderConfigured ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operational
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Needs Key
                </span>
              )}
            </div>
          </div>

          {/* Research Provider */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Market Research Provider</span>
                <span className="text-slate-500">
                  {settings.researchProviderConfigured
                    ? 'Connected — External verified web research active'
                    : 'Optional — Connect SEARCH_API_KEY for live verified web lookups'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {settings.researchProviderConfigured ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="text-slate-400 font-medium text-[11px]">
                  Optional (Not Configured)
                </span>
              )}
            </div>
          </div>

          {/* Storage Provider */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Data Persistence Storage</span>
                <span className="text-slate-500">
                  Browser Local Storage — 100% private to this browser session.
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Local & Private
            </span>
          </div>
        </div>

        {/* Backend Endpoint Override (Optional) */}
        <form onSubmit={handleSaveApiUrl} className="pt-4 border-t border-slate-100 space-y-2">
          <label className="block text-xs font-semibold text-slate-800">
            Custom Backend Base URL (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="e.g. http://localhost:8000 (leave blank to use built-in Express server)"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
            >
              {isSaved ? 'Saved' : 'Save URL'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            If left blank, VALIDATEAI communicates directly through its built-in full-stack server.
          </p>
        </form>
      </div>

      {/* Project Data Management */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Project Data & Portability</h2>
        <p className="text-xs text-slate-600">
          Export your project as a JSON backup or import an existing validation project from another machine.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onImportClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Import Project JSON
          </button>
          <button
            type="button"
            onClick={handleExportCurrent}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Current Project
          </button>
        </div>
      </div>

      {/* Danger Zone: Clear Local Data */}
      <div className="bg-white border border-rose-200 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-rose-900">Danger Zone</h2>
        <p className="text-xs text-rose-700">
          Permanently delete all locally stored validation projects, version snapshots, and custom configurations.
        </p>

        {showClearConfirm ? (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg space-y-3">
            <p className="text-xs text-rose-900 font-semibold">
              Are you sure? This action cannot be undone. Make sure you have exported backups if needed.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors"
              >
                Yes, Delete All Data
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Local Data
          </button>
        )}
      </div>
    </div>
  );
};
