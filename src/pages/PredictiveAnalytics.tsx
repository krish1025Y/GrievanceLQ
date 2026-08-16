import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  Calendar,
  Layers,
  Zap,
  CheckCircle,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPICard } from '../components/common/KPICard';
import { PREDICTIVE_FORECAST, SEASONAL_SURGES } from '../data/mockData';

export const PredictiveAnalytics: React.FC = () => {
  // Scenario What-If sliders
  const [staffChangePct, setStaffChangePct] = useState<number>(0);
  const [inflowSurgePct, setInflowSurgePct] = useState<number>(0);
  const [automationRatePct, setAutomationRatePct] = useState<number>(25);

  // Computed scenario outcomes
  const baseBreachRate = 4.2;
  const simulatedBreachRate = Math.max(
    1.2,
    Number((baseBreachRate - staffChangePct * 0.25 + inflowSurgePct * 0.35 - (automationRatePct - 25) * 0.15).toFixed(1))
  );

  const simulatedAvgLatency = Math.max(
    2.5,
    Number((6.2 - staffChangePct * 0.08 + inflowSurgePct * 0.1 - (automationRatePct - 25) * 0.05).toFixed(1))
  );

  const simulatedStaffRisk = simulatedBreachRate > 8 ? 'High Crisis' : simulatedBreachRate > 5 ? 'Moderate Risk' : 'Optimal Capacity';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-purple-600" />
              Machine Learning & Time-Series Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">ARIMA + Transformer Ensemble</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Predictive Analytics & Workload Forecasting
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            6-month predictive horizon forecasting seasonal volume spikes, SLA breach vulnerabilities, and resource optimization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-purple-900 text-purple-100 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5">
            <Activity size={13} className="text-purple-300" />
            Forecast Confidence: <strong>94.2%</strong>
          </div>
        </div>
      </div>

      {/* Model Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="ML Forecast Accuracy (MAPE)"
          value="91.4%"
          subValue="Mean Abs. Error: ±3.2%"
          icon={<Sparkles size={18} />}
          accentColor="purple"
          tooltipText="Historical validation against actual monthly grievance inflows."
        />
        <KPICard
          title="Breach Prediction Precision"
          value="88.2%"
          subValue="True Positive Rate"
          icon={<ShieldAlert size={18} />}
          accentColor="blue"
          tooltipText="Model ability to flag complaints that would have breached SLA without intervention."
        />
        <KPICard
          title="Projected 6M Total Surge"
          value="+14.8%"
          subValue="Peak Month: July (Monsoon)"
          icon={<TrendingUp size={18} />}
          accentColor="amber"
          tooltipText="Estimated growth in grievance registrations driven by seasonal events."
        />
        <KPICard
          title="Automated Triage Routing"
          value="76.5%"
          subValue="Zero-Touch Classification"
          icon={<CheckCircle size={18} />}
          accentColor="emerald"
          tooltipText="Proportion of cases routed directly to exact subordinate desk using LLM entity extraction."
        />
      </div>

      {/* 6-Month Predictive Horizon Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-600" />
              6-Month Grievance Volume Forecast with 95% Confidence Bounds
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Anticipated monthly complaint volume trajectory through Autumn 2026.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block"></span> Predicted Expected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-200 inline-block"></span> 95% Upper/Lower Bound
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PREDICTIVE_FORECAST} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} domain={[15000, 30000]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                formatter={(val: any) => [val.toLocaleString(), 'Cases']}
              />
              <Area type="monotone" dataKey="upperBound" stroke="#c084fc" fillOpacity={1} fill="url(#colorConfidence)" name="Upper Bound (High Surge)" />
              <Line type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={3} dot={{ r: 5 }} name="Expected Forecast" />
              <Line type="monotone" dataKey="lowerBound" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" name="Lower Bound" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* What-If Scenario Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders size={16} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Interactive Decision Simulation Sandbox
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            "What-If" Policy & Resource Allocation Simulator
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Dynamically evaluate the impact of nodal staffing levels, seasonal surge spikes, and AI automation on SLA breach rates and latency.
          </p>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-4 rounded-xl border border-white/10">
          {/* Staffing Change */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Nodal Staff Capacity:</span>
              <span className="font-mono font-bold text-purple-300">
                {staffChangePct > 0 ? `+${staffChangePct}%` : `${staffChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={staffChangePct}
              onChange={(e) => setStaffChangePct(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-30% (Staff Cut)</span>
              <span>Baseline (0%)</span>
              <span>+30% (Augmented)</span>
            </div>
          </div>

          {/* Grievance Inflow Surge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">External Surge Inflow:</span>
              <span className="font-mono font-bold text-amber-300">+{inflowSurgePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={inflowSurgePct}
              onChange={(e) => setInflowSurgePct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Normal Load</span>
              <span>+25% Surge</span>
              <span>+50% (Extreme Event)</span>
            </div>
          </div>

          {/* AI Automated Classification */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">AI Auto-Triage Adoption:</span>
              <span className="font-mono font-bold text-emerald-300">{automationRatePct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={automationRatePct}
              onChange={(e) => setAutomationRatePct(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Manual)</span>
              <span>25% (Current)</span>
              <span>80% (Advanced AI)</span>
            </div>
          </div>
        </div>

        {/* Simulated Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300">Simulated SLA Breach Rate</span>
              <p className={`text-xl font-extrabold font-mono mt-0.5 ${simulatedBreachRate > 6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {simulatedBreachRate}%
              </p>
              <span className="text-[10px] text-slate-400">Baseline: 4.2%</span>
            </div>
            <ShieldAlert size={24} className={simulatedBreachRate > 6 ? 'text-rose-400' : 'text-emerald-400'} />
          </div>

          <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300">Simulated Avg Turnaround</span>
              <p className="text-xl font-extrabold font-mono text-blue-300 mt-0.5">
                {simulatedAvgLatency} Days
              </p>
              <span className="text-[10px] text-slate-400">Baseline: 6.2 Days</span>
            </div>
            <TrendingUp size={24} className="text-blue-400" />
          </div>

          <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300">System Vulnerability State</span>
              <p className="text-base font-extrabold text-amber-300 mt-1">
                {simulatedStaffRisk}
              </p>
              <span className="text-[10px] text-slate-400">Readiness assessment</span>
            </div>
            <Zap size={24} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Seasonal Grievance Surge Patterns & Predictive Anomaly Detector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Seasonal Surges */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              Seasonal Surge Calendar & Proactive Preparedness
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Historical cyclical surges predicted to repeat in upcoming seasonal cycles.
          </p>

          <div className="space-y-2.5">
            {SEASONAL_SURGES.map((surge) => (
              <div key={surge.season} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{surge.season} ({surge.months})</span>
                  <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    {surge.surgePercentage}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">Category: {surge.category}</p>
                <div className="p-2 bg-blue-50/60 rounded text-[11px] text-blue-950">
                  <strong>Proactive Directive:</strong> {surge.actionMitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Anomaly Detector */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              Live Statistical Anomaly Radar (Z-Score &gt; 3.0)
            </h3>
            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
              3 Active Outliers
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Unusual spikes in specific categories or districts deviating significantly from 90-day moving averages.
          </p>

          <div className="space-y-2.5">
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-900">Pune District • NHAI Highway Compensation</span>
                <span className="font-mono font-bold text-rose-700">+340% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-700">
                142 complaints filed within 48 hours following expressway toll notification and land demarcation.
              </p>
              <div className="text-[10px] text-rose-700 font-medium pt-1">
                Trigger: Media report broadcast + Local panchayat resolution.
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900">Patna & Muzaffarpur • Ayushman Card Sync Failure</span>
                <span className="font-mono font-bold text-amber-800">+185% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-700">
                API gateway timeout between state hospital portal and National Health Authority server.
              </p>
              <div className="text-[10px] text-amber-800 font-medium pt-1">
                Trigger: Software patch rollback required at NIC Bihar node.
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900">Lucknow Hub • DBT Pension Aadhaar Seeding</span>
                <span className="font-mono font-bold text-purple-800">+140% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-700">
                Senior citizen pension batch rejection due to bank NPCI mapper synchronization error.
              </p>
              <div className="text-[10px] text-purple-800 font-medium pt-1">
                Trigger: Bank merger IFSC code deprecation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
