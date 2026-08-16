import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  subValue?: string;
  changePct?: number;
  changePeriodText?: string;
  icon: React.ReactNode;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
  tooltipText?: string;
  sparklineData?: number[];
  progressPct?: number;
  isInverseMetric?: boolean; // If true, negative change is good (e.g. pending grievances down is good)
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subValue,
  changePct,
  changePeriodText = 'vs previous period',
  icon,
  accentColor = 'blue',
  tooltipText,
  sparklineData,
  progressPct,
  isInverseMetric = false,
}) => {
  const accentStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  }[accentColor];

  const isPositiveChange = (changePct ?? 0) > 0;
  const isNeutral = (changePct ?? 0) === 0;

  // Good vs bad logic
  const isGood = isInverseMetric ? !isPositiveChange : isPositiveChange;

  return (
    <div
      id={id}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all duration-200 group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
            {title}
            {tooltipText && (
              <span className="text-slate-400 hover:text-slate-600 cursor-help" title={tooltipText}>
                <Info size={12} />
              </span>
            )}
          </span>
          <div className={`p-1.5 rounded-lg ${accentStyles.bg} ${accentStyles.text} border ${accentStyles.border}`}>
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
            {value}
          </span>
          {subValue && (
            <span className="text-xs font-medium text-slate-500">{subValue}</span>
          )}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        {changePct !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 font-bold text-xs ${
                isNeutral
                  ? 'text-slate-500'
                  : isGood
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {isNeutral ? (
                <Minus size={12} />
              ) : isPositiveChange ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {isPositiveChange ? `+${changePct}%` : `${changePct}%`}
            </span>
            <span className="text-[10px] text-slate-400 truncate">{changePeriodText}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400">Updated live</span>
        )}

        {progressPct !== undefined && (
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                progressPct > 80 ? 'bg-emerald-500' : progressPct > 60 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
