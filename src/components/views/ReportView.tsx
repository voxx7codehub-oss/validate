import React from 'react';
import { StartupProject } from '../../types';
import { TrustBadge } from '../TrustBadge';
import {
  FileText,
  Download,
  Printer,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface ReportViewProps {
  project: StartupProject;
}

export const ReportView: React.FC<ReportViewProps> = ({ project }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    const md = `# STARTUP VALIDATION REPORT: ${project.name || 'Untitled Startup'}
Generated: ${new Date().toLocaleDateString()} via VALIDATEAI

---

## 1. Executive Summary
Validation assessment for **${project.name || 'Startup'}**.
The founder proposes: ${project.idea.whatBuilding}
Core problem tackled: ${project.idea.problemSolved}
Primary customer target: ${project.customerAnalysis.primaryCustomer}

---

## 2. Startup Concept
- **Building:** ${project.idea.whatBuilding}
- **Problem Statement:** ${project.idea.problemSolved}
- **Target Customer:** ${project.idea.whoExperiences}
- **Proposed Solution:** ${project.solution.coreConcept}
- **Value Proposition:** ${project.solution.valueProposition}

---

## 3. Customer Analysis
- **Primary Persona:** ${project.customerAnalysis.primaryCustomer} (${project.customerAnalysis.customerType})
- **Industry Vertical:** ${project.customerAnalysis.industry}
- **Geography:** ${project.customerAnalysis.geography}
- **Current Workarounds:** ${project.customerAnalysis.currentBehavior}

### Customer Interview Questions (Neutral Discovery)
${(project.customerAnalysis.interviewQuestions || [])
  .map((q, i) => `${i + 1}. "${q.question}" [${q.category}] - Purpose: ${q.purpose}`)
  .join('\n')}

---

## 4. Market Research & Scope
- **Target Market:** ${project.marketAnalysis.targetMarket}
- **Verified Market Size:** ${
      project.marketAnalysis.marketSize.isVerified
        ? `TAM: ${project.marketAnalysis.marketSize.tam} (Source: ${project.marketAnalysis.marketSize.source})`
        : 'Market size information is not verified yet. Connect a research provider or add verified research.'
    }

---

## 5. Competitor & Alternative Analysis
- **Direct Competitors:** ${(project.competitorAnalysis.directCompetitors || []).map((c) => c.name).join(', ') || 'None verified'}
- **Indirect Competitors:** ${(project.competitorAnalysis.indirectCompetitors || []).map((c) => c.name).join(', ') || 'None verified'}
- **Habit Substitutes:** ${(project.competitorAnalysis.substitutes || []).map((c) => c.name).join(', ') || 'Spreadsheets / Manual'}

### Competitive Gaps (AI-generated hypothesis)
${(project.competitorAnalysis.gaps || [])
  .map((g) => `- [${g.area}] ${g.observation} -> Opportunity: ${g.opportunity}`)
  .join('\n')}

---

## 6. Business Model & Economics
- **Revenue Model:** ${project.businessModel.modelType}
- **Pricing:** ${project.businessModel.pricing.rationale}
- **Key Costs:** ${project.businessModel.costStructure.join(', ')}

---

## 7. Assumptions Tracker
${project.assumptions
  .map(
    (a, i) =>
      `${i + 1}. [${a.status}] ${a.statement} (${a.priority} Priority, Category: ${a.category}, Method: ${a.validationMethod})`
  )
  .join('\n')}

---

## 8. Risk Matrix
${project.risks
  .map(
    (r, i) =>
      `${i + 1}. **${r.title}** (${r.category} | Impact: ${r.impact}) - Mitigation: ${r.mitigation}`
  )
  .join('\n')}

---

## 9. MVP Planner
- **Core Hypothesis to Test:** ${project.mvpPlan.coreHypothesisToTest}
- **Target Build Duration:** ${project.mvpPlan.buildTargetDuration}
${(project.mvpPlan.features || [])
  .map((f) => `- [${f.priority}] ${f.feature}: ${f.description} (Validation: ${f.validationPurpose})`)
  .join('\n')}

---

## 10. Go-To-Market
- **Initial Beachhead:** ${project.gtmPlan.initialCustomer}
- **First Action:** ${project.gtmPlan.firstAction}

---

## 11. Limitations & Transparency Statement
- This report synthesizes structured analysis, founder assumptions, and available research.
- VALIDATEAI provides rigorous information and structured inquiry; the founder retains full authority and responsibility for commercial decisions.
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name ? project.name.toLowerCase().replace(/\s+/g, '_') : 'startup'}_validation_report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name ? project.name.toLowerCase().replace(/\s+/g, '_') : 'startup'}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
      {/* Top Header & Export Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Startup Validation Report</h1>
            <TrustBadge type="AI ANALYSIS" />
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive executive summary of problem certainty, customer inquiry, and risk mitigation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Markdown
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            <FileCode className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* The Printable Document */}
      <article className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 space-y-10 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold tracking-wider text-slate-900 uppercase">VALIDATEAI EXECUTIVE REPORT</span>
            <span className="font-mono">{new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {project.name || 'Untitled Startup Project'}
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">{project.idea.whatBuilding}</p>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              01 Executive Summary
            </h2>
            <TrustBadge type="AI ANALYSIS" size="sm" />
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>
              This validation assessment evaluates the commercial viability and uncertainty of{' '}
              <strong>{project.name}</strong>, targeting{' '}
              <strong>{project.customerAnalysis.primaryCustomer || 'specified buyers'}</strong> in the{' '}
              <strong>{project.customerAnalysis.industry || 'designated vertical'}</strong>.
            </p>
            <p>
              The core challenge is verifying whether the problem statement ("{project.idea.problemSolved}") occurs with sufficient frequency and friction that buyers will actively dismantle their existing habits or spreadsheets.
            </p>
          </div>
        </section>

        {/* 2. Startup Concept & Original Input */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              02 Startup Concept
            </h2>
            <TrustBadge type="USER INPUT" size="sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Problem Tackled:</span>
              <p className="text-slate-600">{project.idea.problemSolved}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Proposed Solution:</span>
              <p className="text-slate-600">{project.solution.coreConcept}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Target Audience:</span>
              <p className="text-slate-600">{project.idea.whoExperiences}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold text-slate-700 block mb-0.5">Promised Value Proposition:</span>
              <p className="text-slate-600">{project.solution.valueProposition}</p>
            </div>
          </div>
        </section>

        {/* 3. Market Scope & Verification Status */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              03 Market Scope & Size
            </h2>
            <TrustBadge type={project.marketAnalysis.marketSize.isVerified ? 'VERIFIED' : 'NEEDS VALIDATION'} size="sm" />
          </div>
          <div className="text-xs text-slate-700 space-y-2">
            <p>
              <strong>Target Vertical:</strong> {project.marketAnalysis.industry} · Geography: {project.marketAnalysis.geography}
            </p>
            {project.marketAnalysis.marketSize.isVerified ? (
              <div className="p-3 bg-emerald-50/40 border border-emerald-200 rounded text-xs text-emerald-950">
                <span>
                  <strong>Verified TAM:</strong> {project.marketAnalysis.marketSize.tam} · Source:{' '}
                  {project.marketAnalysis.marketSize.source} ({project.marketAnalysis.marketSize.publisher})
                </span>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500">
                Market size information is not verified yet. Connect a research provider or add verified research citations.
              </div>
            )}
          </div>
        </section>

        {/* 4. Customer Discovery & Neutral Questions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              04 Customer Interview Questions
            </h2>
            <TrustBadge type="AI ANALYSIS" size="sm" />
          </div>
          <p className="text-xs text-slate-500">
            Strictly neutral, non-leading inquiries formulated to uncover past observable behavior:
          </p>
          <div className="space-y-2">
            {(project.customerAnalysis.interviewQuestions || []).slice(0, 5).map((q, i) => (
              <div key={q.id || i} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs text-slate-800">
                <span className="font-semibold text-slate-900">{i + 1}. "{q.question}"</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">Purpose: {q.purpose}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Competitor & Alternative Landscape */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              05 Alternative Landscape & Gaps
            </h2>
            <TrustBadge type="AI ANALYSIS" size="sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-1">Direct & Indirect Rivals</span>
              <p className="text-slate-600">
                {[
                  ...(project.competitorAnalysis.directCompetitors || []),
                  ...(project.competitorAnalysis.indirectCompetitors || []),
                ]
                  .map((c) => c.name)
                  .join(', ') || 'No direct software rivals recorded.'}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-1">Habit & Manual Substitutes</span>
              <p className="text-slate-600">
                {(project.competitorAnalysis.substitutes || []).map((s) => s.name).join(', ') ||
                  'Manual spreadsheets, paper tracking, or doing nothing.'}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Critical Assumptions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              06 Key Assumptions
            </h2>
            <TrustBadge type="ASSUMPTION" size="sm" />
          </div>
          <div className="space-y-2">
            {project.assumptions.map((a, idx) => (
              <div
                key={a.id || idx}
                className="p-3 bg-slate-50 rounded border border-slate-100 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-medium text-slate-800">{a.statement}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    Category: {a.category} · Method: {a.validationMethod}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. MVP Scope */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              07 MVP Scope & Experiment Plan
            </h2>
            <TrustBadge type="AI ANALYSIS" size="sm" />
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1 mb-2">
            <div>
              <strong>Core Hypothesis: </strong>
              <span>{project.mvpPlan.coreHypothesisToTest}</span>
            </div>
            <div>
              <strong>Target Duration: </strong>
              <span>{project.mvpPlan.buildTargetDuration}</span>
            </div>
          </div>
          <div className="space-y-2">
            {(project.mvpPlan.features || [])
              .filter((f) => f.priority === 'MUST HAVE')
              .map((f, i) => (
                <div key={f.id || i} className="p-2.5 bg-white rounded border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-900">[MUST HAVE] {f.feature}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{f.description}</p>
                </div>
              ))}
          </div>
        </section>

        {/* 8. Limitations & Methodology Note */}
        <section className="pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Info className="w-4 h-4 text-blue-600" />
            Methodology & Limitations
          </div>
          <p className="leading-relaxed">
            VALIDATEAI does not generate synthetic confidence scores or guaranteed outcomes. Startup success depends on empirical customer behavior in response to real value. All research points not backed by cited URLs should be treated as hypothesis subject to validation testing.
          </p>
        </section>
      </article>
    </div>
  );
};
