import React, { useState } from 'react';
import {
  StartupProject,
  Assumption,
  Risk,
  ValidationExperiment,
  MVPFeature,
  AssumptionStatus,
  MVPPriority,
  ValidationExperimentMethod,
} from '../../types';
import { TrustBadge } from '../TrustBadge';
import {
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  Layers,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface ValidationViewProps {
  project: StartupProject;
  onUpdateProject: (updated: StartupProject) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  project,
  onUpdateProject,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'experiments' | 'assumptions' | 'risks' | 'mvp' | 'gtm'>('checklist');

  // Form states for adding items
  const [showAddAssumption, setShowAddAssumption] = useState(false);
  const [newAssumptionStatement, setNewAssumptionStatement] = useState('');
  const [newAssumptionCategory, setNewAssumptionCategory] = useState<Assumption['category']>('Customer');
  const [newAssumptionPriority, setNewAssumptionPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newAssumptionMethod, setNewAssumptionMethod] = useState('Interview');

  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskDesc, setNewRiskDesc] = useState('');
  const [newRiskCategory, setNewRiskCategory] = useState<Risk['category']>('Customer');
  const [newRiskLikelihood, setNewRiskLikelihood] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newRiskImpact, setNewRiskImpact] = useState<'Low' | 'Medium' | 'High'>('High');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');

  const [showAddExperiment, setShowAddExperiment] = useState(false);
  const [newExpObjective, setNewExpObjective] = useState('');
  const [newExpMethod, setNewExpMethod] = useState<ValidationExperimentMethod>('Interview');
  const [newExpParticipants, setNewExpParticipants] = useState('5-10 target users');
  const [newExpSuccess, setNewExpSuccess] = useState('');

  const [showAddFeature, setShowAddFeature] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');
  const [newFeaturePriority, setNewFeaturePriority] = useState<MVPPriority>('MUST HAVE');
  const [newFeatureReason, setNewFeatureReason] = useState('');
  const [newFeaturePurpose, setNewFeaturePurpose] = useState('');

  const plan = project.validationPlan;
  const checklist = plan.checklist || [];
  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
            completedAt: !item.completed ? new Date().toISOString() : undefined,
          }
        : item
    );

    const updated: StartupProject = {
      ...project,
      validationPlan: {
        ...project.validationPlan,
        checklist: updatedChecklist,
      },
    };
    onUpdateProject(updated);
  };

  // Add Assumption
  const handleAddAssumption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssumptionStatement.trim()) return;

    const newA: Assumption = {
      id: `assump_${Date.now()}`,
      statement: newAssumptionStatement.trim(),
      category: newAssumptionCategory,
      priority: newAssumptionPriority,
      status: 'Unvalidated',
      evidence: '',
      validationMethod: newAssumptionMethod,
      sourceType: 'USER INPUT',
    };

    onUpdateProject({
      ...project,
      assumptions: [newA, ...project.assumptions],
    });
    setNewAssumptionStatement('');
    setShowAddAssumption(false);
  };

  // Update Assumption Status
  const handleUpdateAssumptionStatus = (id: string, status: AssumptionStatus) => {
    const updated = project.assumptions.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    onUpdateProject({ ...project, assumptions: updated });
  };

  // Delete Assumption
  const handleDeleteAssumption = (id: string) => {
    onUpdateProject({
      ...project,
      assumptions: project.assumptions.filter((a) => a.id !== id),
    });
  };

  // Add Risk
  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskTitle.trim()) return;

    const newR: Risk = {
      id: `risk_${Date.now()}`,
      title: newRiskTitle.trim(),
      description: newRiskDesc.trim(),
      category: newRiskCategory,
      likelihood: newRiskLikelihood,
      impact: newRiskImpact,
      mitigation: newRiskMitigation.trim() || 'Active validation inquiry',
      validationAction: 'Test with target cohort',
      status: 'Active',
      sourceType: 'USER INPUT',
    };

    onUpdateProject({
      ...project,
      risks: [newR, ...project.risks],
    });
    setNewRiskTitle('');
    setNewRiskDesc('');
    setNewRiskMitigation('');
    setShowAddRisk(false);
  };

  // Delete Risk
  const handleDeleteRisk = (id: string) => {
    onUpdateProject({
      ...project,
      risks: project.risks.filter((r) => r.id !== id),
    });
  };

  // Add Experiment
  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpObjective.trim()) return;

    const newExp: ValidationExperiment = {
      id: `exp_${Date.now()}`,
      objective: newExpObjective.trim(),
      method: newExpMethod,
      participants: newExpParticipants.trim(),
      questions: [],
      successCriteria: newExpSuccess.trim() || 'Measurable adoption behavior demonstrated',
      status: 'Planned',
      sourceType: 'USER INPUT',
    };

    onUpdateProject({
      ...project,
      validationPlan: {
        ...project.validationPlan,
        experiments: [newExp, ...plan.experiments],
      },
    });
    setNewExpObjective('');
    setNewExpSuccess('');
    setShowAddExperiment(false);
  };

  // Add MVP Feature
  const handleAddFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;

    const newF: MVPFeature = {
      id: `feat_${Date.now()}`,
      feature: newFeatureName.trim(),
      description: newFeatureDesc.trim(),
      priority: newFeaturePriority,
      reason: newFeatureReason.trim() || 'Required for initial workflow',
      validationPurpose: newFeaturePurpose.trim() || 'Verify core friction resolution',
      sourceType: 'USER INPUT',
    };

    onUpdateProject({
      ...project,
      mvpPlan: {
        ...project.mvpPlan,
        features: [newF, ...(project.mvpPlan.features || [])],
      },
    });
    setNewFeatureName('');
    setNewFeatureDesc('');
    setNewFeatureReason('');
    setNewFeaturePurpose('');
    setShowAddFeature(false);
  };

  // Toggle Feature Priority
  const handleFeaturePriority = (id: string, priority: MVPPriority) => {
    const updatedFeatures = (project.mvpPlan.features || []).map((f) =>
      f.id === id ? { ...f, priority } : f
    );
    onUpdateProject({
      ...project,
      mvpPlan: { ...project.mvpPlan, features: updatedFeatures },
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Validation</h1>
            <TrustBadge type="AI ANALYSIS" />
          </div>
          <p className="text-xs text-slate-500">
            Identify the assumptions that matter most and test them with real-world evidence.
          </p>
        </div>

        {/* Real Checklist Completion Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 min-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-800">Checklist Progress</span>
            <span className="font-mono text-blue-700 font-bold tabular-nums">
              {progressPercent}% ({completedCount}/{checklist.length})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-2xl">
        {[
          { id: 'checklist', label: 'Checklist' },
          { id: 'experiments', label: 'Experiments' },
          { id: 'assumptions', label: `Assumptions (${project.assumptions.length})` },
          { id: 'risks', label: `Risks (${project.risks.length})` },
          { id: 'mvp', label: 'MVP Planner' },
          { id: 'gtm', label: 'Go-To-Market' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: VALIDATION CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Validation Checklist</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete these non-negotiable validation steps before committing major development resources.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{completedCount}</span> of{' '}
              <span className="font-semibold text-slate-800">{checklist.length}</span> completed
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  item.completed
                    ? 'bg-emerald-50/30 border-emerald-200 text-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="pt-0.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-blue-500'
                    }`}
                  >
                    {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-sm font-semibold mb-0.5 ${
                      item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                </div>
                {item.completedAt && (
                  <span className="text-[10px] text-emerald-800 font-mono shrink-0">
                    Verified {new Date(item.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VALIDATION EXPERIMENTS */}
      {activeSubTab === 'experiments' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Empirical Experiments Plan</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured real-world tests: Interviews, smoke landing pages, concierge prototypes, and pricing preorders.
              </p>
            </div>
            <button
              onClick={() => setShowAddExperiment(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              New Experiment
            </button>
          </div>

          {showAddExperiment && (
            <form onSubmit={handleAddExperiment} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-800">Design Validation Test</div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Objective <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newExpObjective}
                  onChange={(e) => setNewExpObjective(e.target.value)}
                  placeholder="e.g., Determine if independent operators will commit a refundable $50 pilot reservation"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Testing Method</label>
                  <select
                    value={newExpMethod}
                    onChange={(e) => setNewExpMethod(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="Interview">Interview</option>
                    <option value="Survey">Survey</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Pricing Test">Pricing Test</option>
                    <option value="Preorder">Preorder</option>
                    <option value="Concierge">Concierge (Manual Delivery)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Participants / Sample Size</label>
                  <input
                    type="text"
                    value={newExpParticipants}
                    onChange={(e) => setNewExpParticipants(e.target.value)}
                    placeholder="e.g., 15 target coffee shop managers"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Success Criteria (Pass / Fail Threshold)
                </label>
                <input
                  type="text"
                  value={newExpSuccess}
                  onChange={(e) => setNewExpSuccess(e.target.value)}
                  placeholder="e.g., At least 4 out of 15 participants place a reservation deposit"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Experiment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExperiment(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {plan.experiments.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{exp.objective}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {exp.method}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      Status: {exp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 my-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-medium text-slate-800">Target Participants: </span>
                      <span>{exp.participants}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-800">Success Criteria: </span>
                      <span>{exp.successCriteria}</span>
                    </div>
                  </div>

                  {exp.findings && (
                    <div className="text-xs text-slate-700 p-2.5 bg-emerald-50/50 rounded border border-emerald-100 mb-2">
                      <strong className="text-emerald-900">Findings: </strong>
                      {exp.findings}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Validation Experiment</span>
                  <TrustBadge type={exp.sourceType || 'AI ANALYSIS'} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSUMPTIONS TRACKER */}
      {activeSubTab === 'assumptions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Assumption Tracking</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every critical hypothesis documented with priority, validation method, and empirical status.
              </p>
            </div>
            <button
              onClick={() => setShowAddAssumption(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Assumption
            </button>
          </div>

          {showAddAssumption && (
            <form onSubmit={handleAddAssumption} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-800">Log Critical Assumption</div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Statement <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAssumptionStatement}
                  onChange={(e) => setNewAssumptionStatement(e.target.value)}
                  placeholder="e.g., Customers consider weekend milk stockouts painful enough to pay $99/mo to prevent."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newAssumptionCategory}
                    onChange={(e) => setNewAssumptionCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Market">Market</option>
                    <option value="Product">Product</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Competition">Competition</option>
                    <option value="Technology">Technology</option>
                    <option value="Regulation">Regulation</option>
                    <option value="Operations">Operations</option>
                    <option value="Revenue">Revenue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newAssumptionPriority}
                    onChange={(e) => setNewAssumptionPriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Validation Method</label>
                  <input
                    type="text"
                    value={newAssumptionMethod}
                    onChange={(e) => setNewAssumptionMethod(e.target.value)}
                    placeholder="e.g., Customer Interview, Pricing Test"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Assumption
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAssumption(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {project.assumptions.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{a.statement}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {a.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                        a.priority === 'High'
                          ? 'bg-rose-50 text-rose-700'
                          : a.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Validation Method: <strong>{a.validationMethod}</strong>
                    {a.evidence ? ` · Evidence: ${a.evidence}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={a.status}
                    onChange={(e) => handleUpdateAssumptionStatus(a.id, e.target.value as AssumptionStatus)}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded bg-white text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="Unvalidated">Unvalidated</option>
                    <option value="Testing">Testing</option>
                    <option value="Supported">Supported</option>
                    <option value="Contradicted">Contradicted</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDeleteAssumption(a.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RISKS MATRIX */}
      {activeSubTab === 'risks' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Risk Assessment Matrix</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyze and mitigate operational, market, customer, and technological threats.
              </p>
            </div>
            <button
              onClick={() => setShowAddRisk(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Risk
            </button>
          </div>

          {showAddRisk && (
            <form onSubmit={handleAddRisk} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-800">Add Specific Risk</div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Risk Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRiskTitle}
                  onChange={(e) => setNewRiskTitle(e.target.value)}
                  placeholder="e.g., POS Vendor Restricts Data API Access"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newRiskDesc}
                  onChange={(e) => setNewRiskDesc(e.target.value)}
                  placeholder="Why this risk poses a threat to adoption or business continuity..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newRiskCategory}
                    onChange={(e) => setNewRiskCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Market">Market</option>
                    <option value="Product">Product</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Competition">Competition</option>
                    <option value="Technology">Technology</option>
                    <option value="Regulation">Regulation</option>
                    <option value="Operations">Operations</option>
                    <option value="Revenue">Revenue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Likelihood</label>
                  <select
                    value={newRiskLikelihood}
                    onChange={(e) => setNewRiskLikelihood(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Impact</label>
                  <select
                    value={newRiskImpact}
                    onChange={(e) => setNewRiskImpact(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mitigation Strategy</label>
                <input
                  type="text"
                  value={newRiskMitigation}
                  onChange={(e) => setNewRiskMitigation(e.target.value)}
                  placeholder="e.g., Provide CSV export import fallback and partner directly with certified developer program"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Risk
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRisk(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {project.risks.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between text-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{r.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        r.impact === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Impact: {r.impact}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRisk(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600">{r.description}</p>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div>
                    <strong className="text-slate-700">Mitigation: </strong>
                    <span className="text-slate-600">{r.mitigation}</span>
                  </div>
                  {r.validationAction && (
                    <div className="text-blue-700">
                      <strong>Validation Action: </strong>
                      <span>{r.validationAction}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MVP PLANNER */}
      {activeSubTab === 'mvp' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Minimum Viable Product (MVP) Planner</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The purpose of an MVP is to prevent building unnecessary features before validating the core problem.
              </p>
            </div>
            <button
              onClick={() => setShowAddFeature(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Feature
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="font-semibold text-slate-800">Core Hypothesis to Test: </span>
            <span className="text-slate-700">
              {project.mvpPlan.coreHypothesisToTest ||
                'Validate whether users will engage the single primary value workflow.'}
            </span>
          </div>

          {showAddFeature && (
            <form onSubmit={handleAddFeature} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-800">Define Scope Item</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Feature Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    placeholder="e.g., Weekly Automated Re-order Draft"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newFeaturePriority}
                    onChange={(e) => setNewFeaturePriority(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  >
                    <option value="MUST HAVE">MUST HAVE</option>
                    <option value="SHOULD HAVE">SHOULD HAVE</option>
                    <option value="LATER">LATER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newFeatureDesc}
                  onChange={(e) => setNewFeatureDesc(e.target.value)}
                  placeholder="What this feature does in the minimal version..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Reason for Inclusion</label>
                  <input
                    type="text"
                    value={newFeatureReason}
                    onChange={(e) => setNewFeatureReason(e.target.value)}
                    placeholder="Why this cannot be omitted from early testing..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Validation Purpose</label>
                  <input
                    type="text"
                    value={newFeaturePurpose}
                    onChange={(e) => setNewFeaturePurpose(e.target.value)}
                    placeholder="What specific uncertainty this tests..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Save Feature
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFeature(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Three Categorization Buckets: MUST HAVE, SHOULD HAVE, LATER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['MUST HAVE', 'SHOULD HAVE', 'LATER'] as MVPPriority[]).map((bucket) => {
              const features = (project.mvpPlan.features || []).filter((f) => f.priority === bucket);
              return (
                <div key={bucket} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          bucket === 'MUST HAVE'
                            ? 'text-blue-700'
                            : bucket === 'SHOULD HAVE'
                            ? 'text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {bucket}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-bold tabular-nums">
                        {features.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {features.map((f) => (
                        <div
                          key={f.id}
                          className="bg-white p-3 rounded-md border border-slate-200 shadow-xs text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-900">{f.feature}</span>
                            <div className="flex items-center gap-1">
                              <select
                                value={f.priority}
                                onChange={(e) => handleFeaturePriority(f.id, e.target.value as any)}
                                className="text-[10px] font-mono border border-slate-200 rounded p-0.5 bg-slate-50"
                              >
                                <option value="MUST HAVE">MUST</option>
                                <option value="SHOULD HAVE">SHOULD</option>
                                <option value="LATER">LATER</option>
                              </select>
                            </div>
                          </div>
                          <p className="text-slate-600 text-[11px]">{f.description}</p>
                          <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                            <strong>Validation Purpose: </strong>
                            {f.validationPurpose}
                          </div>
                        </div>
                      ))}
                      {features.length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-400">
                          No features in {bucket}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: GO-TO-MARKET */}
      {activeSubTab === 'gtm' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Go-To-Market Execution Plan</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Practical, low-friction discovery channels and launch experiments to acquire the first 10 customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
                Initial Customer Beachhead
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {project.gtmPlan.initialCustomer || project.customerAnalysis.primaryCustomer}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700 block mb-1 uppercase tracking-wider text-[11px]">
                Positioning Angle
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {project.gtmPlan.positioning || project.solution.valueProposition}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-blue-900 text-sm">First Action for This Week:</div>
            <p className="text-slate-800">
              {project.gtmPlan.firstAction ||
                `Identify 20 ${project.customerAnalysis.primaryCustomer || 'target users'} and reach out for exploratory discovery calls.`}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Acquisition Channels
            </div>
            <div className="space-y-3">
              {(project.gtmPlan.acquisitionChannels?.length > 0
                ? project.gtmPlan.acquisitionChannels
                : [
                    {
                      id: 'ch1',
                      channel: 'Direct Founder Outreach',
                      tactics: 'Personalized messaging to 50 local operators explaining discovery research',
                      expectedCost: 'Low ($0)',
                      feasibility: 'High',
                    },
                    {
                      id: 'ch2',
                      channel: 'Niche Community Forums & Slack Groups',
                      tactics: 'Participate constructively in specialty vertical discussions without spamming pitches',
                      expectedCost: 'Low ($0)',
                      feasibility: 'Medium',
                    },
                  ]
              ).map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{ch.channel}</h3>
                    <p className="text-slate-600">{ch.tactics}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
                    <span>Cost: <strong className="text-slate-700">{ch.expectedCost}</strong></span>
                    <span>Feasibility: <strong className="text-slate-700">{ch.feasibility}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
