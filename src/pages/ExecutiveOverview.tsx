import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Building,
  MapPin,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Layers,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  GRIEVANCE_VOLUME_TREND,
  DEPARTMENTS_DATA,
  STATES_DATA,
  SLA_ALERTS_DATA,
} from '../data/mockData';
import { GrievanceRecord, StateMetric } from '../types';

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
  const [activeAnalysisView, setActiveAnalysisView] = useState<'trends' | 'categories'>('trends');

  // Streamlined category distribution
  const topCategories = [
    { name: 'Pension Disbursal', count: 18400, color: '#0b3c6d' },
    { name: 'Power & Billing', count: 14200, color: '#1e40af' },
    { name: 'Highways & Tolls', count: 12900, color: '#0369a1' },
    { name: 'Rural Wages (MGNREGA)', count: 11400, color: '#047857' },
    { name: 'Public Distribution (PDS)', count: 9800, color: '#475569' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Clean Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-[#0b3c6d] text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#0b3c6d]" />
              Executive Command Center
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time CPGRAMS Analytics</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            National Grievance Intelligence & Resolution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Key indicators, interactive geospatial monitoring, and departmental performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-3.5 py-2 bg-[#0b3c6d] hover:bg-[#082a4d] text-white rounded-lg text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} />
            Decision Support
          </button>
        </div>
      </div>

      {/* 2. Primary 4 High-Level KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          id="kpi-total-grievances"
          title="Total Ingested"
          value="1,25,456"
          changePct={8.4}
          icon={<FileText size={18} />}
          accentColor="blue"
          tooltipText="Total citizen grievances registered in current period."
        />
        <KPICard
          id="kpi-pending-grievances"
          title="Pending Load"
          value="45,632"
          changePct={-4.2}
          isInverseMetric={true}
          icon={<Clock size={18} />}
          accentColor="amber"
          tooltipText="Active cases under review across all ministries."
        />
        <KPICard
          id="kpi-sla-compliance"
          title="SLA Compliance"
          value="88.6%"
          changePct={3.4}
          progressPct={88.6}
          icon={<ShieldCheck size={18} />}
          accentColor="emerald"
          tooltipText="Cases disposed within statutory 30-day timeline."
        />
        <KPICard
          id="kpi-high-risk-escalations"
          title="Active Escalations"
          value="1,842"
          subValue="1.4% of total load"
          changePct={-8.1}
          isInverseMetric={true}
          icon={<AlertTriangle size={18} />}
          accentColor="slate"
          tooltipText="High-priority escalations requiring immediate nodal intervention."
        />
      </div>

      {/* 3. Hero Geospatial Leaflet Map Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={17} className="text-[#0b3c6d]" />
              Geospatial Command Map
            </h2>
            <p className="text-xs text-slate-500">
              Interactive Leaflet GIS map with state hubs, district metrics, and live SLA indicators.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('maps')}
            className="text-xs text-[#0b3c6d] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Full Map Studio <ArrowUpRight size={13} />
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

      {/* 4. Balanced 2-Column Section: Core Trends & Top Department Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Columns: Volume Trajectory / Category Toggle */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-[#0b3c6d]" />
                  Resolution & Disposal Trajectory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly intake vs. completed disposals across national hubs.
                </p>
              </div>

              {/* View Switcher: Trends vs Category Breakdown */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveAnalysisView('trends')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeAnalysisView === 'trends'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setActiveAnalysisView('categories')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    activeAnalysisView === 'categories'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Top Categories
                </button>
              </div>
            </div>

            {activeAnalysisView === 'trends' ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={GRIEVANCE_VOLUME_TREND} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [val.toLocaleString(), 'Cases']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="total" name="Incoming Intake" stroke="#0b3c6d" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#047857" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="pending" name="Pending Load" stroke="#b45309" strokeWidth={2} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCategories} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={110} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                      formatter={(val: any) => [val.toLocaleString(), 'Cases']}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {topCategories.map((entry, index) => (
                        <Cell key={`cat-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall disposal rate: <strong className="text-slate-800">92.4%</strong></span>
            <button
              onClick={() => onNavigateTab('trends')}
              className="text-[#0b3c6d] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Detailed Analytics <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Top Ministry Performance Leaderboard */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Building size={15} className="text-[#0b3c6d]" />
                  Key Ministry Benchmarks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top departments ranked by compliance & speed.</p>
              </div>
              <button
                onClick={() => onNavigateTab('department')}
                className="text-xs text-[#0b3c6d] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                All Ministries <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {DEPARTMENTS_DATA.slice(0, 5).map((dept, idx) => (
                <div
                  key={dept.id}
                  onClick={() => onNavigateTab('department')}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 font-mono">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate group-hover:text-[#0b3c6d]">{dept.shortName}</p>
                      <p className="text-[10px] text-slate-500">{dept.resolved.toLocaleString()} resolved • {dept.avgResolutionDays}d avg</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-mono font-bold ${dept.performanceScore > 80 ? 'text-[#047857]' : dept.performanceScore > 70 ? 'text-[#0b3c6d]' : 'text-[#b45309]'}`}>
                      {dept.performanceScore}/100
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">{dept.slaCompliancePct}% SLA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated across 10 central ministries</span>
            <span className="font-semibold text-slate-700">CPGRAMS Quality Index</span>
          </div>
        </div>
      </div>

      {/* 5. Clean Incident Action Strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Incident & SLA Escalation Gateway</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {SLA_ALERTS_DATA.length} active high-priority cases require custodial attention across regional hubs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('sla')}
            className="w-full md:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            Open SLA Monitor ({SLA_ALERTS_DATA.length})
          </button>
        </div>
      </div>
    </div>
  );
};
