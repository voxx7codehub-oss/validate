import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface Stage {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface AnalysisLoadingProps {
  stages: Stage[];
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ stages }) => {
  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Your Startup Idea</h2>
          <p className="text-sm text-slate-600">
            Structuring customer segments, discovering competitive dynamics, and identifying core uncertainties.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {stages.map((stage) => {
            return (
              <div
                key={stage.id}
                className="flex items-center justify-between p-3 rounded-md border border-slate-100 bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {stage.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : stage.status === 'in_progress' ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      stage.status === 'completed'
                        ? 'text-slate-900 font-medium'
                        : stage.status === 'in_progress'
                        ? 'text-blue-900 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {stage.status === 'completed'
                    ? 'Done'
                    : stage.status === 'in_progress'
                    ? 'In progress...'
                    : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skeleton content preview */}
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded animate-pulse w-full"></div>
          <div className="h-3 bg-slate-100 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>
  );
};
