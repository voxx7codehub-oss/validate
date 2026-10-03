import React, { useState } from 'react';
import { StartupProject, InterviewQuestion, CustomerPainPoint } from '../../types';
import { TrustBadge } from '../TrustBadge';
import { Users, AlertCircle, HelpCircle, Plus, Copy, Check, Trash2 } from 'lucide-react';

interface CustomerViewProps {
  project: StartupProject;
  onUpdateProject: (updated: StartupProject) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  project,
  onUpdateProject,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState<InterviewQuestion['category']>('Problem Frequency');

  const customer = project.customerAnalysis;

  // Default interview questions if none generated yet
  const questions: InterviewQuestion[] = customer.interviewQuestions?.length > 0
    ? customer.interviewQuestions
    : [
        {
          id: 'q_default_1',
          question: 'How do you currently solve this problem?',
          purpose: 'Identify existing workflows, active habits, and current tools.',
          category: 'Current Behavior',
          isNeutral: true,
          sourceType: 'AI ANALYSIS',
        },
        {
          id: 'q_default_2',
          question: 'How often do you experience this problem?',
          purpose: 'Determine problem cadence and whether it occurs frequently enough to warrant switching.',
          category: 'Problem Frequency',
          isNeutral: true,
          sourceType: 'AI ANALYSIS',
        },
        {
          id: 'q_default_3',
          question: 'What is difficult about your current solution?',
          purpose: 'Uncover specific friction points and frustrations with existing workarounds.',
          category: 'Alternative Friction',
          isNeutral: true,
          sourceType: 'AI ANALYSIS',
        },
        {
          id: 'q_default_4',
          question: 'What alternatives have you tried?',
          purpose: 'Verify whether the customer has actively expended effort or money searching for a fix.',
          category: 'Current Behavior',
          isNeutral: true,
          sourceType: 'AI ANALYSIS',
        },
        {
          id: 'q_default_5',
          question: 'What would make you change your current approach?',
          purpose: 'Explore decision triggers and switching friction without pitching your specific solution.',
          category: 'Decision Dynamics',
          isNeutral: true,
          sourceType: 'AI ANALYSIS',
        },
      ];

  const handleCopyQuestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: InterviewQuestion = {
      id: `q_user_${Date.now()}`,
      question: newQuestionText.trim(),
      purpose: 'Founder custom interview inquiry',
      category: newQuestionCategory,
      isNeutral: true,
      sourceType: 'USER INPUT',
    };

    const updated: StartupProject = {
      ...project,
      customerAnalysis: {
        ...project.customerAnalysis,
        interviewQuestions: [newQ, ...questions],
      },
    };

    onUpdateProject(updated);
    setNewQuestionText('');
  };

  const handleDeleteQuestion = (id: string) => {
    const updated: StartupProject = {
      ...project,
      customerAnalysis: {
        ...project.customerAnalysis,
        interviewQuestions: questions.filter((q) => q.id !== id),
      },
    };
    onUpdateProject(updated);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Analysis</h1>
          <TrustBadge type={customer.sourceType || 'AI ANALYSIS'} />
        </div>
        <p className="text-xs text-slate-500">
          Understand customer behavior, pain intensity, and prepare non-leading discovery interviews.
        </p>
      </div>

      {/* Primary Customer Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          Primary Customer Profile
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Primary Customer
            </span>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {customer.primaryCustomer || 'Not specified'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Customer Type
            </span>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {customer.customerType || 'Startup'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Industry
            </span>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {customer.industry || 'Not specified'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Geography
            </span>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              {customer.geography || 'Global'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
          <div>
            <span className="font-semibold text-slate-800 block mb-1">Current Behavior</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
              {customer.currentBehavior ||
                'Customers currently rely on fragmented tools, manual spreadsheets, or simply accept the operational delay.'}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-800 block mb-1">Willingness to Pay Insights</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
              {customer.willingnessToPayNotes ||
                'Willingness to pay is an active hypothesis. Early discovery sessions should quantify the cost of their current workaround.'}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      {customer.segments?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Target Customer Segments
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.segments.map((seg) => (
              <div
                key={seg.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{seg.name}</h3>
                    {seg.isPrimary && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{seg.description}</p>
                </div>

                {seg.buyingFactors?.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Key Buying Factors:
                    </span>
                    <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                      {seg.buyingFactors.map((bf, idx) => (
                        <li key={idx}>{bf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pain Points */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          Customer Pain Points
        </div>

        <div className="space-y-3">
          {((customer.painPoints?.length > 0
            ? customer.painPoints
            : [
                {
                  id: 'p_1',
                  description: project.problem.statement || 'Core problem description',
                  severity: 'Moderate',
                  frequency: 'Frequently',
                  emotionalImpact: '',
                  sourceType: 'USER INPUT',
                },
              ]) as CustomerPainPoint[]
          ).map((pain) => (
            <div
              key={pain.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="max-w-2xl">
                <p className="font-medium text-slate-800 text-sm mb-1">{pain.description}</p>
                {pain.emotionalImpact && (
                  <p className="text-slate-500">Impact: {pain.emotionalImpact}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-500">
                  Frequency: <strong className="text-slate-700">{pain.frequency}</strong>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${
                    pain.severity === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : pain.severity === 'Severe'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {pain.severity} Severity
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Needs & Objections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Customer Needs & Buying Factors</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {(customer.buyingFactors?.length > 0
              ? customer.buyingFactors
              : [
                  'Fast setup without complex software migrations',
                  'Clear return on investment within 30-60 days',
                  'Reliable support and easy team training',
                ]
            ).map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">·</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Typical Objections</h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {(customer.objections?.length > 0
              ? customer.objections
              : [
                  '"Our current spreadsheet system is good enough for now."',
                  '"We do not have time to learn a new tool this quarter."',
                  '"Budget is already allocated to existing vendors."',
                ]
            ).map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">·</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Customer Interview Questions (Strictly Neutral) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Customer Interview Questions</h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Non-Leading Discovery
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unbiased inquiries designed to understand reality without prompting false affirmations.
            </p>
          </div>
        </div>

        {/* Add Custom Question Form */}
        <form onSubmit={handleAddQuestion} className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-800 mb-2">Add Customer Interview Question</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g., When was the last time you dealt with this, and what went wrong?"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
            />
            <select
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value as any)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none"
            >
              <option value="Problem Frequency">Problem Frequency</option>
              <option value="Current Behavior">Current Behavior</option>
              <option value="Alternative Friction">Alternative Friction</option>
              <option value="Willingness to Pay">Willingness to Pay</option>
              <option value="Decision Dynamics">Decision Dynamics</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shrink-0 flex items-center gap-1 justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">"{q.question}"</span>
                  <span className="text-[10px] text-slate-500 font-mono">[{q.category}]</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  <strong>Purpose:</strong> {q.purpose}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyQuestion(q.question, q.id)}
                  title="Copy question text"
                  className="px-2.5 py-1 text-xs border border-slate-200 rounded text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                >
                  {copiedId === q.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  title="Remove question"
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
