import React from 'react';
import { StartupProject, FeasibilityStatus } from '../../types';
import { TrustBadge } from '../TrustBadge';
import { Briefcase, CheckCircle2, HelpCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface BusinessViewProps {
  project: StartupProject;
}

export const BusinessView: React.FC<BusinessViewProps> = ({ project }) => {
  const biz = project.businessModel;
  const feas = project.feasibilityAnalysis;
  const swot = project.swotAnalysis;

  const getFeasibilityIcon = (status: FeasibilityStatus) => {
    switch (status) {
      case 'Feasible':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Uncertain':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'Challenging':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Unknown':
      default:
        return <AlertOctagon className="w-4 h-4 text-slate-400" />;
    }
  };

  const getFeasibilityBadge = (status: FeasibilityStatus) => {
    switch (status) {
      case 'Feasible':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Uncertain':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Challenging':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Unknown':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Analysis</h1>
          <TrustBadge type="AI ANALYSIS" />
        </div>
        <p className="text-xs text-slate-500">
          Clean structural breakdown of economic viability, operational feasibility, and market mechanics.
        </p>
      </div>

      {/* Clean 8-Point Business Architecture (No cluttered canvas) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          Business Architecture
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Customer
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {project.customerAnalysis.primaryCustomer || 'Target Buyer'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {project.customerAnalysis.customerType} · {project.customerAnalysis.industry}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Value Proposition
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {biz.valueProposition || project.solution.valueProposition || 'Promised outcome'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Revenue Model
            </span>
            <p className="text-xs text-slate-800 font-medium">{biz.modelType}</p>
            <p className="text-[11px] text-slate-500 mt-1">Primary monetization mechanism</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Pricing Hypothesis
            </span>
            <p className="text-xs text-slate-800 font-medium">
              {biz.pricing?.rationale || 'Tiered subscription based on value generated'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Customer Channels
            </span>
            <p className="text-xs text-slate-800">
              {biz.customerChannels?.length > 0
                ? biz.customerChannels.join(', ')
                : 'Direct outreach, specialized industry directories, inbound search'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Cost Structure
            </span>
            <p className="text-xs text-slate-800">
              {biz.costStructure?.length > 0
                ? biz.costStructure.join(', ')
                : 'Software engineering, cloud hosting, customer acquisition'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Key Resources
            </span>
            <p className="text-xs text-slate-800">
              {biz.keyResources?.length > 0
                ? biz.keyResources.join(', ')
                : 'Domain expertise, engineering talent, proprietary workflows'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Key Partners
            </span>
            <p className="text-xs text-slate-800">
              {biz.keyPartners?.length > 0
                ? biz.keyPartners.join(', ')
                : 'Platform APIs, industry trade associations, integration distributors'}
            </p>
          </div>
        </div>
      </div>

      {/* Feasibility Analysis */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Feasibility Analysis</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Objective technical, operational, and financial assessment. Note: The system does not claim guaranteed success or failure.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Statuses: Feasible · Uncertain · Challenging · Unknown</span>
          </div>
        </div>

        <div className="space-y-4">
          {(feas.areas?.length > 0
            ? feas.areas
            : [
                {
                  area: 'Customer',
                  status: 'Feasible' as FeasibilityStatus,
                  summary: 'Target audience has clear pain and reachable contact channels.',
                  reasons: ['Accessible via LinkedIn and direct outreach', 'Suffers measurable operational time loss'],
                  evidence: [],
                  assumptions: ['Customers are empowered to purchase without multi-layer committee approval.'],
                },
                {
                  area: 'Technology',
                  status: 'Feasible' as FeasibilityStatus,
                  summary: 'Standard web application architecture with accessible APIs.',
                  reasons: ['No exotic research-grade breakthroughs required', 'Off-the-shelf cloud tooling sufficient'],
                  evidence: [],
                  assumptions: ['Third-party APIs remain open and accessible.'],
                },
                {
                  area: 'Business',
                  status: 'Uncertain' as FeasibilityStatus,
                  summary: 'Unit economics dependent on customer acquisition cost vs. lifetime value.',
                  reasons: ['Willingness to pay requires active empirical testing', 'Pricing benchmark must be verified against workarounds'],
                  evidence: [],
                  assumptions: ['Annual churn remains under 15%.'],
                },
                {
                  area: 'Regulatory',
                  status: 'Feasible' as FeasibilityStatus,
                  summary: 'Standard commercial data privacy and industry standards apply.',
                  reasons: ['No specialized banking or medical licenses required'],
                  evidence: [],
                  assumptions: ['No impending municipal or vertical compliance changes.'],
                },
              ]
          ).map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  {getFeasibilityIcon(f.status)}
                  <h3 className="text-sm font-semibold text-slate-900">{f.area} Feasibility</h3>
                  <span
                    className={`text-[10px] font-semibold uppercase font-mono px-2 py-0.5 rounded border ${getFeasibilityBadge(
                      f.status
                    )}`}
                  >
                    {f.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{f.summary}</p>

                {f.reasons?.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Key Rationale:
                    </span>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                      {f.reasons.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {f.assumptions?.length > 0 && (
                <div className="md:w-72 bg-white p-3 rounded border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-amber-800 block mb-1">
                    Underlying Assumption:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {f.assumptions[0]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Strategic SWOT Assessment
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              Strengths
            </h3>
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {(swot.strengths?.length > 0
                ? swot.strengths
                : [
                    { id: 's1', text: 'Tailored specifically to vertical workflow needs' },
                    { id: 's2', text: 'Low-touch onboarding compared to enterprise competitors' },
                  ]
              ).map((s) => (
                <li key={s.id} className="flex items-start gap-1.5">
                  <span className="font-bold">·</span>
                  <span>{s.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/40 border border-amber-200">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Weaknesses
            </h3>
            <ul className="space-y-1.5 text-xs text-amber-950">
              {(swot.weaknesses?.length > 0
                ? swot.weaknesses
                : [
                    { id: 'w1', text: 'Early brand absence requiring outbound trust building' },
                    { id: 'w2', text: 'Reliance on customer willingness to alter ingrained habits' },
                  ]
              ).map((w) => (
                <li key={w.id} className="flex items-start gap-1.5">
                  <span className="font-bold">·</span>
                  <span>{w.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/40 border border-blue-200">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Opportunities
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-950">
              {(swot.opportunities?.length > 0
                ? swot.opportunities
                : [
                    { id: 'o1', text: 'Expanding to adjacent regional markets after beachhead' },
                    { id: 'o2', text: 'Automating partner vendor ordering for network effects' },
                  ]
              ).map((o) => (
                <li key={o.id} className="flex items-start gap-1.5">
                  <span className="font-bold">·</span>
                  <span>{o.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-rose-50/40 border border-rose-200">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">
              Threats
            </h3>
            <ul className="space-y-1.5 text-xs text-rose-950">
              {(swot.threats?.length > 0
                ? swot.threats
                : [
                    { id: 't1', text: 'Incumbent POS vendors releasing lightweight copycat modules' },
                    { id: 't2', text: 'Customer inertia defaulting back to familiar spreadsheets' },
                  ]
              ).map((t) => (
                <li key={t.id} className="flex items-start gap-1.5">
                  <span className="font-bold">·</span>
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
