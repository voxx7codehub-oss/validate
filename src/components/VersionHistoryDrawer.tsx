import React, { useState } from 'react';
import { ProjectVersion, StartupProject } from '../types';
import { saveVersion, loadVersions, restoreVersion } from '../services/storage';
import { History, X, RotateCcw, Plus, Check, Clock } from 'lucide-react';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: StartupProject;
  onProjectRestored: (restored: StartupProject) => void;
  onCompareVersions: (v1: StartupProject, v2: StartupProject) => void;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onProjectRestored,
  onCompareVersions,
}) => {
  const [versions, setVersions] = useState<ProjectVersion[]>(loadVersions(project.id));
  const [newLabel, setNewLabel] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = saveVersion(
        project.id,
        newLabel.trim() || `Version ${versions.length + 1}`,
        newDesc.trim() || 'Manual snapshot'
      );
      setVersions([v, ...versions]);
      setNewLabel('');
      setNewDesc('');
      setShowCreate(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestore = (versionId: string) => {
    const restored = restoreVersion(project.id, versionId);
    if (restored) {
      setRestoredId(versionId);
      setTimeout(() => {
        setRestoredId(null);
        onProjectRestored(restored);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Version History & Snapshots</h2>
              <p className="text-[11px] text-slate-400">Revert or compare milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {showCreate ? (
            <form onSubmit={handleCreateSnapshot} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs mb-4">
              <span className="font-semibold text-slate-800 block">Take Project Snapshot</span>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Version 2 - Updated customer segment"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Optional notes or context..."
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Snapshot
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-xs font-medium text-slate-700 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors mb-4"
            >
              <Plus className="w-3.5 h-3.5" />
              Take New Snapshot
            </button>
          )}

          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 text-xs space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{ver.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(ver.timestamp).toLocaleDateString()} {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">{ver.description}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onCompareVersions(ver.snapshot, project)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Compare with Current
                </button>
                <button
                  onClick={() => handleRestore(ver.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                >
                  {restoredId === ver.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Restored</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {versions.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-400">
              No version snapshots recorded yet. Create one to capture this milestone.
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-400">
          Snapshots preserve full startup state and can be restored anytime.
        </div>
      </div>
    </div>
  );
};
