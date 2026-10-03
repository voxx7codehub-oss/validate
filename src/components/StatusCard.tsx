import React from 'react';
import { StatusIndicator } from '../types';
import { CheckCircle2, AlertCircle, CircleDot, ChevronRight } from 'lucide-react';

interface StatusCardProps {
  title: string;
  description: string;
  status: StatusIndicator;
  onClick: () => void;
  metric?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  description,
  status,
  onClick,
  metric,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'Complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'Needs Review':
        return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'Not Started':
      default:
        return <CircleDot className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getStatusTextClass = () => {
    switch (status) {
      case 'Complete':
        return 'text-emerald-700';
      case 'Needs Review':
        return 'text-amber-700';
      case 'Not Started':
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 transition-all text-left cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            {getStatusIcon()}
            <span className={getStatusTextClass()}>{status}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{description}</p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>{metric || 'Review section'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
