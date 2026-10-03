import React from 'react';
import { SourceType } from '../types';

interface TrustBadgeProps {
  type: SourceType | string;
  size?: 'sm' | 'md';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ type, size = 'sm' }) => {
  // Enforce zero-pill anti-slop guidelines: unboxed text with subtle typographic styling
  switch (type) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-emerald-800 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          VERIFIED
        </span>
      );
    case 'AI ANALYSIS':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-blue-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          AI ANALYSIS
        </span>
      );
    case 'USER INPUT':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-slate-700 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          USER INPUT
        </span>
      );
    case 'ASSUMPTION':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-amber-800 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
          ASSUMPTION
        </span>
      );
    case 'NEEDS VALIDATION':
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-rose-800 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          NEEDS VALIDATION
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium text-slate-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {type}
        </span>
      );
  }
};
