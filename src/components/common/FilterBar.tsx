import React from 'react';
import { Filter, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import { GlobalFilterState } from '../../types';
import { MINISTRIES_AND_DEPTS, STATES_AND_DISTRICTS } from '../../data/mockData';

interface FilterBarProps {
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onReset: () => void;
  totalFilteredCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalFilteredCount,
}) => {
  const selectedStateObj = filters.state ? STATES_AND_DISTRICTS[filters.state] : null;
  const availableDistricts = selectedStateObj ? selectedStateObj.districts : [];

  const hasActiveFilters =
    filters.state !== '' ||
    filters.district !== '' ||
    filters.department !== '' ||
    filters.category !== '' ||
    filters.priority !== '' ||
    filters.status !== '' ||
    filters.riskLevel !== '' ||
    filters.dateRange !== '30d';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
      {/* Top Filter Controls: Quick Horizon Buttons + Selects */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Time Horizon Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 shrink-0">
            Time Horizon:
          </span>
          {[
            { id: '30d', label: 'Last 30 Days' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'today', label: 'Today (Live)' },
            { id: 'custom', label: 'FY 2026' },
          ].map((item) => {
            const isActive = filters.dateRange === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onFilterChange({ dateRange: item.id as any })}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0b3c6d] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Total Count Badge */}
        {totalFilteredCount !== undefined && (
          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 shrink-0">
            <span>Records:</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {totalFilteredCount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Grid of Targeted Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {/* State Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">State / UT</label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ state: e.target.value, district: '' })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
          >
            <option value="">All States (15)</option>
            {Object.keys(STATES_AND_DISTRICTS).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">District</label>
          <select
            value={filters.district}
            onChange={(e) => onFilterChange({ district: e.target.value })}
            disabled={!filters.state}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Districts ({availableDistricts.length || 'Select State'})</option>
            {availableDistricts.map((dst) => (
              <option key={dst} value={dst}>{dst}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange({ department: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors truncate"
          >
            <option value="">All Departments (10)</option>
            {MINISTRIES_AND_DEPTS.map((m) => (
              <option key={m.department} value={m.department}>{m.department}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Case Status */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Under Review">Under Review</option>
            <option value="Investigation">Investigation</option>
            <option value="Action Taken">Action Taken</option>
            <option value="Resolved">Resolved</option>
            <option value="Appealed">Appealed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Risk Level */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">AI Risk Level</label>
          <select
            value={filters.riskLevel}
            onChange={(e) => onFilterChange({ riskLevel: e.target.value })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors"
          >
            <option value="">All Risk Levels</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Active Filter Badges and Reset */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
            {filters.state && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                State: {filters.state}
                <button onClick={() => onFilterChange({ state: '', district: '' })} className="hover:text-slate-900 font-bold">×</button>
              </span>
            )}
            {filters.district && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                District: {filters.district}
                <button onClick={() => onFilterChange({ district: '' })} className="hover:text-slate-900 font-bold">×</button>
              </span>
            )}
            {filters.department && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200 max-w-xs truncate">
                Dept: {filters.department}
                <button onClick={() => onFilterChange({ department: '' })} className="hover:text-slate-900 font-bold">×</button>
              </span>
            )}
            {filters.priority && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                Priority: {filters.priority}
                <button onClick={() => onFilterChange({ priority: '' })} className="hover:text-slate-900 font-bold">×</button>
              </span>
            )}
            {filters.riskLevel && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs border border-slate-200">
                Risk: {filters.riskLevel}
                <button onClick={() => onFilterChange({ riskLevel: '' })} className="hover:text-slate-900 font-bold">×</button>
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium text-xs py-1 px-2 rounded hover:bg-slate-100 transition-colors ml-auto"
          >
            <RotateCcw size={12} />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
