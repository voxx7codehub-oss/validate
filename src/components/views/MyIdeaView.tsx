import React, { useState } from 'react';
import { StartupProject, BusinessModelType } from '../../types';
import { TrustBadge } from '../TrustBadge';
import { Save, Check, RefreshCw } from 'lucide-react';

interface MyIdeaViewProps {
  project: StartupProject;
  onUpdateProject: (updated: StartupProject) => void;
  onReAnalyze: () => void;
}

export const MyIdeaView: React.FC<MyIdeaViewProps> = ({
  project,
  onUpdateProject,
  onReAnalyze,
}) => {
  const [startupName, setStartupName] = useState(project.idea.startupName || project.name);
  const [whatBuilding, setWhatBuilding] = useState(project.idea.whatBuilding);
  const [problemSolved, setProblemSolved] = useState(project.idea.problemSolved);
  const [whoExperiences, setWhoExperiences] = useState(project.idea.whoExperiences);
  const [solution, setSolution] = useState(project.solution.coreConcept);
  const [valueProposition, setValueProposition] = useState(project.solution.valueProposition);
  const [businessModel, setBusinessModel] = useState<BusinessModelType>(project.businessModel.modelType);
  const [targetMarket, setTargetMarket] = useState(project.marketAnalysis.targetMarket);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const updated: StartupProject = {
      ...project,
      name: startupName.trim() || project.name,
      idea: {
        ...project.idea,
        startupName: startupName.trim(),
        whatBuilding: whatBuilding.trim(),
        problemSolved: problemSolved.trim(),
        whoExperiences: whoExperiences.trim(),
        updatedAt: new Date().toISOString(),
      },
      problem: {
        ...project.problem,
        statement: problemSolved.trim(),
      },
      solution: {
        ...project.solution,
        coreConcept: solution.trim(),
        valueProposition: valueProposition.trim(),
      },
      businessModel: {
        ...project.businessModel,
        modelType: businessModel,
        valueProposition: valueProposition.trim(),
      },
      marketAnalysis: {
        ...project.marketAnalysis,
        targetMarket: targetMarket.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Idea</h1>
            <TrustBadge type="USER INPUT" />
          </div>
          <p className="text-xs text-slate-500">
            The founder’s original input is the immutable source of truth. AI analysis does not overwrite your definitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved Changes
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            Startup Name
          </label>
          <input
            type="text"
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Startup Idea / What Are You Building?
            </label>
            <span className="text-[11px] text-slate-400">Core product definition</span>
          </div>
          <textarea
            rows={3}
            value={whatBuilding}
            onChange={(e) => setWhatBuilding(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Problem Solved
            </label>
            <span className="text-[11px] text-slate-400">The friction or pain experienced</span>
          </div>
          <textarea
            rows={3}
            value={problemSolved}
            onChange={(e) => setProblemSolved(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Target Customer (Who Experiences This?)
            </label>
            <span className="text-[11px] text-slate-400">Audience persona</span>
          </div>
          <textarea
            rows={2}
            value={whoExperiences}
            onChange={(e) => setWhoExperiences(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Solution
            </label>
            <span className="text-[11px] text-slate-400">How you solve it</span>
          </div>
          <textarea
            rows={3}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Value Proposition
            </label>
            <span className="text-[11px] text-slate-400">Specific promised benefit</span>
          </div>
          <textarea
            rows={2}
            value={valueProposition}
            onChange={(e) => setValueProposition(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              Business Model
            </label>
            <select
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value as BusinessModelType)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              {[
                'Subscription',
                'One-time Purchase',
                'Marketplace',
                'Commission',
                'Freemium',
                'Advertising',
                'Usage Based',
                'Other',
              ].map((bm) => (
                <option key={bm} value={bm}>
                  {bm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
              Target Market
            </label>
            <input
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Helper notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
        <div>
          Edited your foundational idea? Run analysis to re-align customer questions, risks, and validation tests.
        </div>
        <button
          onClick={onReAnalyze}
          className="shrink-0 ml-4 font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Update Analysis
        </button>
      </div>
    </div>
  );
};
