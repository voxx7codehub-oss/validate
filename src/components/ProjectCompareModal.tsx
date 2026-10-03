import React, { useState } from 'react';
import { StartupProject } from '../types';
import { X, GitCompare } from 'lucide-react';

interface ProjectCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StartupProject[];
  initialProjectAId?: string;
  initialProjectBId?: string;
  overrideProjectA?: StartupProject;
  overrideProjectB?: StartupProject;
}

export const ProjectCompareModal: React.FC<ProjectCompareModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProjectAId,
  initialProjectBId,
  overrideProjectA,
  overrideProjectB,
}) => {
  const [projAId, setProjAId] = useState<string>(
    initialProjectAId || (projects.length > 0 ? projects[0].id : '')
  );
  const [projBId, setProjBId] = useState<string>(
    initialProjectBId || (projects.length > 1 ? projects[1].id : projects[0]?.id || '')
  );

  if (!isOpen) return null;

  const projectA = overrideProjectA || projects.find((p) => p.id === projAId) || projects[0];
  const projectB = overrideProjectB || projects.find((p) => p.id === projBId) || projects[1] || projects[0];

  if (!projectA || !projectB) return null;

  const compareRows = [
    {
      dimension: 'Problem Statement',
      valA: projectA.idea.problemSolved || projectA.problem.statement || 'Not defined',
      valB: projectB.idea.problemSolved || projectB.problem.statement || 'Not defined',
    },
    {
      dimension: 'Target Customer',
      valA: `${projectA.customerAnalysis.primaryCustomer} (${projectA.customerAnalysis.customerType})`,
      valB: `${projectB.customerAnalysis.primaryCustomer} (${projectB.customerAnalysis.customerType})`,
    },
    {
      dimension: 'Market & Industry',
      valA: `${projectA.customerAnalysis.industry} · ${projectA.marketAnalysis.geography}`,
      valB: `${projectB.customerAnalysis.industry} · ${projectB.marketAnalysis.geography}`,
    },
    {
      dimension: 'Proposed Solution',
      valA: projectA.solution.coreConcept,
      valB: projectB.solution.coreConcept,
    },
    {
      dimension: 'Value Proposition',
      valA: projectA.solution.valueProposition,
      valB: projectB.solution.valueProposition,
    },
    {
      dimension: 'Business Model',
      valA: projectA.businessModel.modelType,
      valB: projectB.businessModel.modelType,
    },
    {
      dimension: 'Active Risks',
      valA: `${projectA.risks.filter((r) => r.status === 'Active').length} active risks`,
      valB: `${projectB.risks.filter((r) => r.status === 'Active').length} active risks`,
    },
    {
      dimension: 'Unvalidated Assumptions',
      valA: `${projectA.assumptions.filter((a) => a.status === 'Unvalidated').length} unvalidated`,
      valB: `${projectB.assumptions.filter((a) => a.status === 'Unvalidated').length} unvalidated`,
    },
    {
      dimension: 'Validation Progress',
      valA: `${projectA.validationPlan.checklist.filter((c) => c.completed).length} / ${projectA.validationPlan.checklist.length} checklist items completed`,
      valB: `${projectB.validationPlan.checklist.filter((c) => c.completed).length} / ${projectB.validationPlan.checklist.length} checklist items completed`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col justify-between overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Project Comparison</h2>
              <p className="text-xs text-slate-500">
                Objective side-by-side evaluation across core validation dimensions (no artificial ranking).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selectors Header */}
        {!overrideProjectA && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border-b border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Project A
              </label>
              <select
                value={projAId}
                onChange={(e) => setProjAId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Project B
              </label>
              <select
                value={projBId}
                onChange={(e) => setProjBId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded bg-white text-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Comparison Table / Matrix */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[11px] w-1/4">
                    Dimension
                  </th>
                  <th className="p-3.5 font-bold text-slate-900 text-sm w-[37.5%] border-l border-slate-200">
                    {projectA.name}
                  </th>
                  <th className="p-3.5 font-bold text-slate-900 text-sm w-[37.5%] border-l border-slate-200">
                    {projectB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {compareRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-semibold text-slate-800 bg-slate-50/60 align-top">
                      {row.dimension}
                    </td>
                    <td className="p-3.5 text-slate-700 leading-relaxed border-l border-slate-200 align-top">
                      {row.valA}
                    </td>
                    <td className="p-3.5 text-slate-700 leading-relaxed border-l border-slate-200 align-top">
                      {row.valB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>The founder chooses which direction to pursue based on evidence.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
