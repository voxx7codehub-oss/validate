import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  missingDescription: string;
  whyItMatters: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  missingDescription,
  whyItMatters,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="border border-slate-200 bg-white rounded-lg p-8 text-center max-w-2xl mx-auto my-6">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
      <div className="space-y-2 text-sm text-slate-600 mb-6 text-left bg-slate-50 border border-slate-200 rounded-md p-4">
        <div>
          <span className="font-medium text-slate-800">What is missing: </span>
          <span>{missingDescription}</span>
        </div>
        <div>
          <span className="font-medium text-slate-800">Why it matters: </span>
          <span>{whyItMatters}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionText && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
