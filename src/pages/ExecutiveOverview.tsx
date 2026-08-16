import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Smile,
  Users,
  Building,
  MapPin,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';
import { IndiaMap } from '../components/common/IndiaMap';
import {
  EXECUTIVE_OVERVIEW_METRICS,
  GRIEVANCE_VOLUME_TREND,
  DEPARTMENTS_DATA,
  STATES_DATA,
  SLA_ALERTS_DATA,
} from '../data/mockData';
import { GrievanceRecord, SLABreachAlert, StateMetric, DistrictMetric } from '../types';

interface ExecutiveOverviewProps {
  onSelectGrievance: (grv: GrievanceRecord) => void;
  grievances: GrievanceRecord[];
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onSelectGrievance,
  grievances,
  onNavigateTab,
}) => {
  const [mapLayer, setMapLayer] = useState<'pending' | 'sla' | 'sentiment' | 'hotspots' | 'volume'>('pending');
  const [selectedState, setSelectedState] = useState<StateMetric | null>(null);

  // Category distribution data aggregated from mock departments
  const categoryData = [
    { name: 'Pension Disbursal', count: 18400, color: '#0b3c6d' },
    { name: 'Power & Overbilling', count: 14200, color: '#2563eb' },
    { name: 'Highways & Tolls', count: 12900, color: '#059669' },
    { name: 'Rural Wages (MGNREGA)', count: 11400, color: '#d97706' },
    { name: 'E-Commerce & PDS', count: 9800, color: '#475569' },
    { name: 'Health & Ayushman', count: 8200, color: '#0284c7' },
    { name: 'Urban Drainage', count: 7100, color: '#64748b' },
  ];

  // SLA Donut Data
  const slaDonutData = [
    { name: 'Compliant (<7 Days)', value: 88.6, color: '#059669' },
    { name: 'At Risk (Near SLA)', value: 7.2, color: '#d97706' },
    { name: 'Breached Violations', value: 4.2, color: '#dc2626' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Overview Banner */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-[#0b3c6d] text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#0b3c6d]" />
              CPGRAMS Executive Hub
            </span>
            <span className="text-xs text-slate-500 font-mono">10 Key Ministries Monitored</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            National Grievance Intelligence & Resolution Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized monitoring of citizen grievance lifecycles, SLA compliance benchmarks, and automated redressal escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-3.5 py-2 bg-[#0b3c6d] hover:bg-[#082a4d] text-white rounded-md text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            Decision Support Actions
          </button>
        </div>
      </div>

      {/* 4 Primary Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          id="kpi-total-grievances"
          title="Total Grievances"
          value="1,25,456"
          changePct={8.4}
          icon={<FileText size={18} />}
          accentColor="blue"
          tooltipText="Total citizen grievances ingested in current fiscal period across all ministries."
        />
        <KPICard
          id="kpi-pending-grievances"
          title="Pending Active Load"
          value="45,632"
          changePct={-4.2}
          isInverseMetric={true}
          icon={<Clock size={18} />}
          accentColor="amber"
          tooltipText="Active cases under review or investigation. Negative change indicates healthy backlog clearance."
        />
        <KPICard
          id="kpi-sla-compliance"
          title="SLA Compliance Rate"
          value="88.6%"
          changePct={3.4}
          progressPct={88.6}
          icon={<ShieldCheck size={18} />}
          accentColor="emerald"
          tooltipText="Percentage of cases disposed within citizen charter timeline (standard 30 days)."
        />
        <KPICard
          id="kpi-high-risk-escalations"
          title="High-Risk Escalations"
          value="1,842"
          subValue="1.4% of total load"
          changePct={-8.1}
          isInverseMetric={true}
          icon={<AlertTriangle size={18} />}
          accentColor="slate"
          tooltipText="Cases flagged by predictive ML models for imminent legal/media escalation."
        />
      </div>

      {/* Geospatial Leaflet Intelligence Landing Hub */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={17} className="text-[#0b3c6d]" />
              National Geospatial Grievance & SLA Command Map
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Leaflet GIS map visualizing state command hubs, district clusters, and live SLA indicators.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('maps')}
            className="text-xs text-[#0b3c6d] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Deep Dive Analytics <ArrowUpRight size={13} />
          </button>
        </div>

        <IndiaMap
          states={STATES_DATA}
          activeLayer={mapLayer}
          onLayerChange={setMapLayer}
          selectedState={selectedState}
          onSelectState={setSelectedState}
        />
      </div>

      {/* Row 1: Volume Trend (Line) + Pending vs Resolved (Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Grievance Volume Trend Line Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Grievance Volume & Disposal Velocity Trend
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly trajectory of incoming citizen complaints versus completed disposals.
              </p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
              FY 2026 Trajectory
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GRIEVANCE_VOLUME_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [val.toLocaleString(), 'Cases']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="total" name="Total Incoming" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pending" name="Pending Load" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending vs Resolved Area Distribution */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pending vs. Resolved Backlog Flow</h3>
              <p className="text-xs text-slate-500 mt-0.5">Clearance efficiency and cumulative disposal ratio.</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GRIEVANCE_VOLUME_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
                <Area type="monotone" dataKey="pending" name="Pending Load" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Category Distribution + SLA Donut + Department Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Category Distribution (Bar) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Grievance Category Distribution</h3>
            <span className="text-xs text-slate-400 font-mono">Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [val.toLocaleString(), 'Cases']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance Donut */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">SLA Charter Compliance</h3>
              <span className="text-xs font-bold text-emerald-600 font-mono">88.6% Healthy</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">30-day statutory redressal threshold adherence.</p>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {slaDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Proportion']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">88.6%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">On Time</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="block text-[11px] text-slate-400">Compliant</span>
              <span className="font-bold text-emerald-600 font-mono">88.6%</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">At Risk</span>
              <span className="font-bold text-amber-600 font-mono">7.2%</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400">Breached</span>
              <span className="font-bold text-rose-600 font-mono">4.2%</span>
            </div>
          </div>
        </div>

        {/* Department Ranking Preview */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Department Performance Rank</h3>
              <button
                onClick={() => onNavigateTab('department')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                View All <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {DEPARTMENTS_DATA.slice(0, 5).map((dept, idx) => (
                <div key={dept.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{dept.shortName}</p>
                      <p className="text-[10px] text-slate-400">{dept.resolved.toLocaleString()} resolved</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-mono font-bold ${dept.performanceScore > 80 ? 'text-emerald-600' : dept.performanceScore > 70 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {dept.performanceScore}/100
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">{dept.avgResolutionDays}d avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">Benchmark based on resolution speed, SLA, and appeal rate.</span>
          </div>
        </div>
      </div>

      {/* Row 3: AI Predictive Insight & Live SLA Incident Feed & State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (lg:col-span-7): State Grievance Heat + AI Predictive Insight */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Predictive Insight Card */}
          <div className="bg-slate-900 rounded-xl shadow-md p-5 text-white flex flex-col justify-between relative overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between z-10 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-400" />
                AI Predictive Intelligence
              </span>
              <span className="px-2.5 py-0.5 bg-blue-950 text-[10px] text-blue-300 rounded border border-blue-800/80 font-mono font-bold">
                Confidence: High (88%)
              </span>
            </div>
            <div className="my-2 z-10">
              <p className="text-sm font-medium leading-relaxed text-slate-200">
                Volume surge of <strong className="text-blue-400">+23%</strong> predicted in{' '}
                <strong className="text-white">Department of Financial Services</strong> over the next 10 days due to regional pension portal server migrations in Patna & Kanpur.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 z-10">
              <span className="truncate">Decision Support: Pre-emptively deploy 15 additional nodal desk officers.</span>
              <button
                onClick={() => onNavigateTab('insights')}
                className="text-blue-400 hover:text-blue-300 font-bold ml-2 shrink-0 flex items-center gap-1 cursor-pointer"
              >
                ML Forecast →
              </button>
            </div>
          </div>

          {/* State Grievance Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin size={16} className="text-blue-600" />
                  State-Wise Grievance Load Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">High-volume state hubs and compliance rankings.</p>
              </div>
              <button
                onClick={() => onNavigateTab('maps')}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Open Interactive Map →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase text-[11px]">
                    <th className="py-2.5 px-3">State / UT</th>
                    <th className="py-2.5 px-3">Total Volume</th>
                    <th className="py-2.5 px-3">Pending Load</th>
                    <th className="py-2.5 px-3">SLA Compliance</th>
                    <th className="py-2.5 px-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {STATES_DATA.slice(0, 5).map((st) => (
                    <tr key={st.stateCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{st.stateName}</td>
                      <td className="py-2.5 px-3 font-mono">{st.totalGrievances.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-rose-700">{st.pendingLoad.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span>{st.slaCompliancePct}%</span>
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${st.slaCompliancePct > 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${st.slaCompliancePct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge type="risk" value={st.riskLevel} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-5): Live Breach & Critical Alerts Feed */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-rose-600" />
                Live SLA & Risk Incident Feed
              </h3>
              <button
                onClick={() => onNavigateTab('sla')}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                SLA Command Center →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Real-time countdown alerts triggered by impending charter violations.
            </p>

            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {SLA_ALERTS_DATA.map((alert, idx) => {
                const isCritical = alert.timeDisplay.includes('Overdue') || idx === 0;
                const isWarning = alert.timeDisplay.includes('18h') || idx === 1;
                return (
                  <div
                    key={alert.id}
                    onClick={() => {
                      const match = grievances.find((g) => g.id === alert.grievanceId);
                      if (match) onSelectGrievance(match);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer group ${
                      isCritical
                        ? 'bg-rose-50/70 border-rose-200 border-l-4 border-l-rose-500 hover:bg-rose-50'
                        : isWarning
                        ? 'bg-amber-50/70 border-amber-200 border-l-4 border-l-amber-500 hover:bg-amber-50'
                        : 'bg-slate-50 border-slate-200 border-l-4 border-l-blue-500 hover:bg-blue-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-blue-700">
                        {alert.registrationNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {alert.timeDisplay}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-snug">{alert.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                      <span>{alert.department} • {alert.district}</span>
                      <span className="font-medium text-slate-700">{alert.assignedOfficer}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>CPGRAMS Nodal Gateway</span>
            <span className="font-mono text-[11px] text-slate-600 font-semibold">Department of Administrative Reforms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
