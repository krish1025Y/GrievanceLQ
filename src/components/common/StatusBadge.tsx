import React from 'react';
import { PriorityLevel, CaseStatus, SLAStatus, RiskLevel, SentimentType } from '../../types';

interface StatusBadgeProps {
  type: 'priority' | 'status' | 'sla' | 'risk' | 'sentiment';
  value: PriorityLevel | CaseStatus | SLAStatus | RiskLevel | SentimentType | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium',
    lg: 'text-sm px-3 py-1.5 rounded-md font-medium',
  }[size];

  if (type === 'priority') {
    switch (value) {
      case 'Critical':
        return <span className={`inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 font-semibold ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>Critical</span>;
      case 'High':
        return <span className={`inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>High</span>;
      case 'Medium':
        return <span className={`inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 font-medium ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Medium</span>;
      case 'Low':
        return <span className={`inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 font-normal ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Low</span>;
      default:
        return <span className={`bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  if (type === 'sla') {
    switch (value) {
      case 'On Track':
        return <span className={`inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>On Track</span>;
      case 'At Risk':
        return <span className={`inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 font-medium ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>At Risk</span>;
      case 'Critical':
        return <span className={`inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-200 font-semibold ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping"></span>Critical</span>;
      case 'Breached':
        return <span className={`inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 font-bold ${sizeClasses}`}><span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>Breached</span>;
      default:
        return <span className={`bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  if (type === 'risk') {
    switch (value) {
      case 'Critical':
        return <span className={`inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 font-semibold ${sizeClasses}`}>Risk: Critical</span>;
      case 'High':
        return <span className={`inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-200 font-medium ${sizeClasses}`}>Risk: High</span>;
      case 'Medium':
        return <span className={`inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium ${sizeClasses}`}>Risk: Medium</span>;
      case 'Low':
        return <span className={`inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 font-normal ${sizeClasses}`}>Risk: Low</span>;
      default:
        return <span className={`bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  if (type === 'sentiment') {
    switch (value) {
      case 'Positive':
        return <span className={`inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium ${sizeClasses}`}>Positive</span>;
      case 'Neutral':
        return <span className={`inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 font-medium ${sizeClasses}`}>Neutral</span>;
      case 'Negative':
        return <span className={`inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 font-medium ${sizeClasses}`}>Negative</span>;
      default:
        return <span className={`bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
    }
  }

  // Case Status
  switch (value) {
    case 'Registered':
      return <span className={`inline-flex items-center bg-sky-50 text-sky-700 border border-sky-200 font-medium ${sizeClasses}`}>Registered</span>;
    case 'Under Review':
      return <span className={`inline-flex items-center bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium ${sizeClasses}`}>Under Review</span>;
    case 'Investigation':
      return <span className={`inline-flex items-center bg-purple-50 text-purple-700 border border-purple-200 font-medium ${sizeClasses}`}>Investigation</span>;
    case 'Action Taken':
      return <span className={`inline-flex items-center bg-teal-50 text-teal-700 border border-teal-200 font-medium ${sizeClasses}`}>Action Taken</span>;
    case 'Resolved':
      return <span className={`inline-flex items-center bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold ${sizeClasses}`}>Resolved</span>;
    case 'Appealed':
      return <span className={`inline-flex items-center bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${sizeClasses}`}>Appealed</span>;
    case 'Closed':
      return <span className={`inline-flex items-center bg-slate-100 text-slate-600 border border-slate-200 font-normal ${sizeClasses}`}>Closed</span>;
    default:
      return <span className={`bg-slate-100 text-slate-700 ${sizeClasses}`}>{value}</span>;
  }
};
