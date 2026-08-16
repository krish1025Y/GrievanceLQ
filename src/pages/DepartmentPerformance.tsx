import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smile,
  FileText,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import { DEPARTMENTS_DATA } from '../data/mockData';
import { DepartmentMetric } from '../types';
import { KPICard } from '../components/common/KPICard';

export const DepartmentPerformance: React.FC = () => {
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>(['dept-nhai', 'dept-banking']);
  const [activeDeptDrawer, setActiveDeptDrawer] = useState<DepartmentMetric | null>(null);

  const toggleDeptSelection = (id: string) => {
    if (selectedDeptIds.includes(id)) {
      if (selectedDeptIds.length > 1) {
        setSelectedDeptIds(selectedDeptIds.filter((d) => d !== id));
      }
    } else {
      setSelectedDeptIds([...selectedDeptIds, id]);
    }
  };

  const selectedDepts = DEPARTMENTS_DATA.filter((d) => selectedDeptIds.includes(d.id));

  // Chart data formatting
  const comparisonData = DEPARTMENTS_DATA.map((d) => ({
    name: d.shortName,
    avgDays: d.avgResolutionDays,
    slaCompliance: d.slaCompliancePct,
    satisfaction: d.citizenSatisfactionPct,
    appealRate: d.appealRatePct,
    score: d.performanceScore,
    total: d.totalGrievances,
    resolvedRate: d.resolutionRatePct,
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Award size={13} className="text-emerald-700" />
              National Benchmarking
            </span>
            <span className="text-xs text-slate-400 font-mono">10 Central Ministries Monitored</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Department Performance & Service Delivery Benchmarks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic scoring based on resolution latency, citizen satisfaction index, premature closure audit, and appeal frequency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Selected for Side-by-Side: <strong>{selectedDeptIds.length} Depts</strong>
          </span>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Top Performing Entity"
          value="RailMadad / Railways"
          subValue="Score: 94/100 (1.8d avg)"
          icon={<Award size={18} />}
          accentColor="emerald"
          tooltipText="Highest overall performance index among all ministries."
        />
        <KPICard
          title="Average National Turnaround"
          value="6.2 Days"
          subValue="Charter: 30 Days"
          icon={<Clock size={18} />}
          accentColor="blue"
          tooltipText="Composite average resolution turnaround across all departments."
        />
        <KPICard
          title="National Citizen Satisfaction"
          value="74.8%"
          subValue="+5.2% YoY Improvement"
          icon={<Smile size={18} />}
          accentColor="emerald"
          tooltipText="Aggregate citizen approval rating post-disposal."
        />
        <KPICard
          title="Highest Escalation Dept"
          value="Rural Development"
          subValue="10.4% Appeal Rate"
          icon={<AlertTriangle size={18} />}
          accentColor="rose"
          tooltipText="Department experiencing greatest secondary appeal friction."
        />
      </div>

      {/* Benchmarking Ranking Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Department Benchmarking & Performance League Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any department row for granular category breakdowns, or check boxes to compare side-by-side.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-3 px-3 w-8">Compare</th>
                <th className="py-3 px-3">Rank & Department</th>
                <th className="py-3 px-3">Total Volume</th>
                <th className="py-3 px-3">Resolved</th>
                <th className="py-3 px-3">Pending</th>
                <th className="py-3 px-3">Resolution Rate</th>
                <th className="py-3 px-3">Avg Latency</th>
                <th className="py-3 px-3">SLA Compliance</th>
                <th className="py-3 px-3">Appeal Rate</th>
                <th className="py-3 px-3">Citizen Satisfaction</th>
                <th className="py-3 px-3">Performance Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEPARTMENTS_DATA.map((dept, idx) => {
                const isSelected = selectedDeptIds.includes(dept.id);
                return (
                  <tr
                    key={dept.id}
                    onClick={() => setActiveDeptDrawer(dept)}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDeptSelection(dept.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 hover:text-blue-700">{dept.name}</p>
                          <p className="text-[10px] text-slate-400">{dept.ministry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold">{dept.totalGrievances.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-emerald-700">{dept.resolved.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-rose-700">{dept.pending.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono font-bold">{dept.resolutionRatePct}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{dept.avgResolutionDays} days</td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`font-bold ${dept.slaCompliancePct > 85 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {dept.slaCompliancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">{dept.appealRatePct}%</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">{dept.citizenSatisfactionPct}%</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900">{dept.performanceScore}</span>
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              dept.performanceScore > 80
                                ? 'bg-emerald-500'
                                : dept.performanceScore > 70
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${dept.performanceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparison Tool / Matrix for Selected Departments */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
              Interactive Comparator
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Side-by-Side Department Comparison Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-400">Comparing {selectedDepts.length} Selected Entities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedDepts.map((dept) => (
            <div key={dept.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{dept.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{dept.shortName}</p>
                </div>
                <button
                  onClick={() => toggleDeptSelection(dept.id)}
                  className="text-slate-400 hover:text-slate-600"
                  title="Remove from comparison"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500">Composite Score:</span>
                  <span className="font-extrabold text-blue-700">{dept.performanceScore}/100</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500">Avg. Turnaround:</span>
                  <span className="font-bold text-slate-900">{dept.avgResolutionDays} days</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500">SLA Adherence:</span>
                  <span className="font-bold text-emerald-700">{dept.slaCompliancePct}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500">Citizen Rating:</span>
                  <span className="font-bold text-slate-900">{dept.citizenSatisfactionPct}%</span>
                </div>
                <div className="flex justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500">Premature Closure:</span>
                  <span className="font-bold text-rose-700">{dept.prematureClosureRatePct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Average Resolution Time by Dept */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Average Resolution Latency (Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="avgDays" name="Avg Resolution Days" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance vs Citizen Satisfaction */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">SLA Compliance vs. Citizen Satisfaction (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="slaCompliance" name="SLA Compliance %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="satisfaction" name="Satisfaction %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Detail Drawer when clicked */}
      {activeDeptDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  Department Deep-Dive Audit
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeDeptDrawer.name}</h3>
                <p className="text-xs text-slate-500">{activeDeptDrawer.ministry}</p>
              </div>
              <button
                onClick={() => setActiveDeptDrawer(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Ingested</span>
                <p className="text-base font-bold text-slate-900">{activeDeptDrawer.totalGrievances.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Resolution Rate</span>
                <p className="text-base font-bold text-emerald-700">{activeDeptDrawer.resolutionRatePct}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold">SLA Compliance</span>
                <p className="text-base font-bold text-blue-700">{activeDeptDrawer.slaCompliancePct}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Active Nodal Custodians</span>
                <p className="text-base font-bold text-slate-900">{activeDeptDrawer.officersCount} Officers</p>
              </div>
            </div>

            {/* Top Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Top Ingested Complaint Categories
              </h4>
              <div className="space-y-2 text-xs">
                {activeDeptDrawer.topCategories.map((cat) => (
                  <div key={cat.category} className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
                    <span className="font-medium text-slate-800">{cat.category}</span>
                    <span className="font-mono font-bold text-slate-900">{cat.count.toLocaleString()} cases</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveDeptDrawer(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
