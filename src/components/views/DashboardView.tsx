import React from 'react';
import { StartupProject, StatusIndicator } from '../../types';
import { StatusCard } from '../StatusCard';
import { WorkspaceTab } from '../Sidebar';
import { ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2, Lightbulb } from 'lucide-react';

interface DashboardViewProps {
  project: StartupProject;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onRunAction: (actionId: string, category: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  onNavigateTab,
  onRunAction,
}) => {
  // Determine structured status indicators without fake scores
  const getProblemStatus = (): StatusIndicator => {
    if (project.problem.statement && project.problem.currentAlternatives?.length > 0) return 'Complete';
    if (project.problem.statement) return 'Needs Review';
    return 'Not Started';
  };

  const getCustomerStatus = (): StatusIndicator => {
    if (project.customerAnalysis.segments?.length > 0 && project.customerAnalysis.painPoints?.length > 0)
      return 'Complete';
    if (project.customerAnalysis.primaryCustomer) return 'Needs Review';
    return 'Not Started';
  };

  const getMarketStatus = (): StatusIndicator => {
    if (project.marketAnalysis.trends?.length > 0 || project.marketAnalysis.drivers?.length > 0)
      return 'Complete';
    if (project.marketAnalysis.industry) return 'Needs Review';
    return 'Not Started';
  };

  const getCompetitionStatus = (): StatusIndicator => {
    const totalCompetitors =
      (project.competitorAnalysis.directCompetitors?.length || 0) +
      (project.competitorAnalysis.indirectCompetitors?.length || 0) +
      (project.competitorAnalysis.substitutes?.length || 0);
    if (totalCompetitors > 0) return 'Complete';
    if (project.competitorAnalysis.gaps?.length > 0) return 'Needs Review';
    return 'Not Started';
  };

  const getBusinessStatus = (): StatusIndicator => {
    if (project.businessModel.revenueStreams?.length > 0 && project.feasibilityAnalysis.areas?.length > 0)
      return 'Complete';
    if (project.businessModel.modelType) return 'Needs Review';
    return 'Not Started';
  };

  const getValidationStatus = (): StatusIndicator => {
    const checklistCompleted = project.validationPlan.checklist.filter((c) => c.completed).length;
    if (checklistCompleted >= 4) return 'Complete';
    if (checklistCompleted > 0 || project.validationPlan.experiments.length > 0) return 'Needs Review';
    return 'Not Started';
  };

  const unvalidatedAssumptions = project.assumptions.filter(
    (a) => a.status === 'Unvalidated'
  ).length;
  const activeRisks = project.risks.filter((r) => r.status === 'Active').length;
  const completedChecklist = project.validationPlan.checklist.filter((c) => c.completed).length;

  // Recommended next steps (based on actual project information)
  const recommendedSteps = project.validationPlan.recommendedActions.length > 0
    ? project.validationPlan.recommendedActions
    : [
        {
          id: 'step_interview',
          title: 'Interview target customers',
          why: 'Confirm whether the problem occurs frequently enough to matter before writing code.',
          priority: 'Immediate',
          status: 'Not Started',
          category: 'Customer',
        },
        {
          id: 'step_research',
          title: 'Research existing solutions',
          why: 'Uncover how target users currently cope and what workarounds they rely on.',
          priority: 'Immediate',
          status: 'Not Started',
          category: 'Competition',
        },
        {
          id: 'step_pay',
          title: 'Test willingness to pay',
          why: 'Verify whether users have discretionary budget or active motivation to buy.',
          priority: 'Next',
          status: 'Not Started',
          category: 'Business',
        },
      ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Startup</h1>
          <p className="text-xs text-slate-500 mt-1">
            Validation assessment and uncertainty management dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-xs">
            <span className="text-slate-500">Unvalidated Assumptions:</span>
            <span className="font-semibold text-amber-700 tabular-nums">
              {unvalidatedAssumptions}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-xs">
            <span className="text-slate-500">Active Risks:</span>
            <span className="font-semibold text-rose-700 tabular-nums">{activeRisks}</span>
          </div>
        </div>
      </div>

      {/* Six Status Cards */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Validation Dimensions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusCard
            title="Problem"
            description={project.problem.statement || 'Define and confirm problem urgency and alternatives.'}
            status={getProblemStatus()}
            onClick={() => onNavigateTab('my-idea')}
            metric={`${project.problem.frequency || 'Weekly'} frequency · ${project.problem.urgency || 'Medium'} urgency`}
          />

          <StatusCard
            title="Customer"
            description={
              project.customerAnalysis.primaryCustomer
                ? `Targeting ${project.customerAnalysis.primaryCustomer} in ${project.customerAnalysis.industry || 'specified vertical'}.`
                : 'Identify customer segments and buying dynamics.'
            }
            status={getCustomerStatus()}
            onClick={() => onNavigateTab('customers')}
            metric={`${project.customerAnalysis.segments?.length || 1} segments · ${project.customerAnalysis.painPoints?.length || 1} pain points`}
          />

          <StatusCard
            title="Market"
            description={
              project.marketAnalysis.overview ||
              'Examine trends, drivers, and target market dynamics.'
            }
            status={getMarketStatus()}
            onClick={() => onNavigateTab('market')}
            metric={`${project.marketAnalysis.trends?.length || 0} trends documented`}
          />

          <StatusCard
            title="Competition"
            description={
              (project.competitorAnalysis.directCompetitors?.length || 0) > 0
                ? `${project.competitorAnalysis.directCompetitors.length} direct competitors identified.`
                : 'Catalogue existing tools, workarounds, and substitutes.'
            }
            status={getCompetitionStatus()}
            onClick={() => onNavigateTab('competitors')}
            metric={`${project.competitorAnalysis.gaps?.length || 0} competitive gaps mapped`}
          />

          <StatusCard
            title="Business"
            description={
              project.businessModel.valueProposition ||
              'Monetization structure, pricing hypotheses, and feasibility.'
            }
            status={getBusinessStatus()}
            onClick={() => onNavigateTab('business')}
            metric={`${project.businessModel.modelType} · ${project.feasibilityAnalysis.areas?.length || 0} feasibility areas`}
          />

          <StatusCard
            title="Validation"
            description="Empirical experiments, checklist progress, and MVP scope."
            status={getValidationStatus()}
            onClick={() => onNavigateTab('validation')}
            metric={`${completedChecklist} / ${project.validationPlan.checklist.length} checklist items verified`}
          />
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recommended Next Steps</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable validation tasks generated specifically from your startup information.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('validation')}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            Open Validation Plan
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {recommendedSteps.map((step) => (
            <div
              key={step.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-900">{step.title}</span>
                  <span className="text-[11px] text-slate-500">· {step.category}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    {step.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl">{step.why}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (step.category.toLowerCase().includes('customer')) {
                      onNavigateTab('customers');
                    } else if (step.category.toLowerCase().includes('competition')) {
                      onNavigateTab('competitors');
                    } else if (step.category.toLowerCase().includes('business')) {
                      onNavigateTab('business');
                    } else {
                      onNavigateTab('validation');
                    }
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                  Start
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uncertainty & Rigor Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Highest Priority Assumptions
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Assumptions with high impact that lack verified real-world evidence.
          </p>
          <div className="space-y-2">
            {project.assumptions.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start justify-between gap-2"
              >
                <span>{a.statement}</span>
                <span className="text-[10px] text-amber-800 font-mono shrink-0">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Validation Checklist Progress
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Foundational milestones to complete before writing production code.
          </p>
          <div className="space-y-2">
            {project.validationPlan.checklist.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs flex items-center justify-between gap-2"
              >
                <span className={c.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                  {c.title}
                </span>
                <span
                  className={`text-[10px] font-mono shrink-0 ${
                    c.completed ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {c.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
