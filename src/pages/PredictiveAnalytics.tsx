import React, { useState, useMemo } from 'react';
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
} from 'recharts';
import {
  Sparkles as SparklesIcon,
  TrendingUp as TrendingUpIcon,
  ShieldAlert as ShieldAlertIcon,
  Calendar as CalendarIcon,
  Sliders as SlidersIcon,
  AlertTriangle as AlertTriangleIcon,
  Activity as ActivityIcon,
  CheckCircle2,
  Zap,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PREDICTIVE_FORECAST, SEASONAL_SURGES } from '../data/mockData';
import { AppLanguage, TRANSLATIONS } from '../utils/translations';

interface PredictiveAnalyticsProps {
  language?: AppLanguage;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const [timeHorizon, setTimeHorizon] = useState<'30d' | '90d' | '6m' | '1y'>('6m');

  // Scenario What-If sliders
  const [staffChangePct, setStaffChangePct] = useState<number>(0);
  const [inflowSurgePct, setInflowSurgePct] = useState<number>(0);
  const [automationRatePct, setAutomationRatePct] = useState<number>(25);

  // Filtered dataset for selected Time Horizon
  const horizonData = useMemo(() => {
    if (timeHorizon === '30d') {
      return PREDICTIVE_FORECAST.slice(0, 2);
    }
    if (timeHorizon === '90d') {
      return PREDICTIVE_FORECAST.slice(0, 3);
    }
    if (timeHorizon === '6m') {
      return PREDICTIVE_FORECAST;
    }
    // 1y extended
    return [
      ...PREDICTIVE_FORECAST,
      { month: 'Oct 2026', predicted: 24200, lowerBound: 21500, upperBound: 27000 },
      { month: 'Nov 2026', predicted: 23100, lowerBound: 20400, upperBound: 25800 },
      { month: 'Dec 2026', predicted: 22000, lowerBound: 19500, upperBound: 24600 },
      { month: 'Jan 2027', predicted: 21800, lowerBound: 19200, upperBound: 24400 },
    ];
  }, [timeHorizon]);

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

  const simulatedStaffRisk =
    simulatedBreachRate > 7 ? 'High Strain' : simulatedBreachRate > 4.5 ? 'Moderate Strain' : 'Optimal Resilience';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Info & Time Horizon Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <SparklesIcon size={13} className="text-slate-700" />
              CPGRAMS Time-Series AI
            </span>
            <span className="text-xs text-slate-400 font-mono">ARIMA + Neural Forecast Ensemble</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Predictive Workload & Time Horizon Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Multi-period predictive horizon forecasting seasonal volume spikes, SLA breach vulnerabilities, and policy resource allocation.
          </p>
        </div>

        {/* Time Horizon Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
          <button
            onClick={() => setTimeHorizon('30d')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              timeHorizon === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeHorizon('90d')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              timeHorizon === '90d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            90 Days (Qtr)
          </button>
          <button
            onClick={() => setTimeHorizon('6m')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              timeHorizon === '6m' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeHorizon('1y')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              timeHorizon === '1y' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1 Year Cycle
          </button>
        </div>
      </div>

      {/* 4 Minimalist KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">ML Forecast Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <SparklesIcon size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">91.4%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Mean Abs. Error: ±3.2%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Breach Prediction Precision</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShieldAlertIcon size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">88.2%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">True Positive Flag Rate</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Projected Peak Surge</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <TrendingUpIcon size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">+14.8%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Peak Period: July (Monsoon)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-500">Zero-Touch NLP Triage</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">76.5%</div>
            <p className="text-[11px] text-slate-500 mt-0.5">Auto-Allocated to Exact Desk</p>
          </div>
        </div>
      </div>

      {/* Main Time-Series Forecast Chart Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUpIcon size={16} className="text-slate-700" />
              Grievance Volume Trajectory & 95% Confidence Bounds
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Predicted monthly complaint intake across departments for the selected {timeHorizon.toUpperCase()} horizon.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-900 inline-block"></span> Expected Forecast
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block"></span> 95% Confidence Bound
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={horizonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="horizonConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `${val / 1000}k`}
                domain={['dataMin - 3000', 'dataMax + 3000']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                }}
                formatter={(val: any) => [val.toLocaleString(), 'Cases']}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="#cbd5e1"
                fillOpacity={1}
                fill="url(#horizonConfidence)"
                name="Confidence Range"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0f172a' }}
                name="Expected Inflow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive What-If Policy Simulation Sandbox */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <SlidersIcon size={16} className="text-slate-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interactive Policy Sandbox
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            What-If Policy & Resource Allocation Simulator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dynamically adjust nodal staffing levels, seasonal surge spikes, and AI automation adoption to evaluate SLA outcomes.
          </p>
        </div>

        {/* Sliders in Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {/* Staffing Change */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-semibold">Nodal Staff Capacity:</span>
              <span className="font-mono font-bold text-slate-900">
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
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-30%</span>
              <span>Baseline</span>
              <span>+30%</span>
            </div>
          </div>

          {/* Grievance Inflow Surge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-semibold">External Surge Load:</span>
              <span className="font-mono font-bold text-slate-900">+{inflowSurgePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={inflowSurgePct}
              onChange={(e) => setInflowSurgePct(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Normal</span>
              <span>+25% Surge</span>
              <span>+50% Extreme</span>
            </div>
          </div>

          {/* AI Automated Classification */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 font-semibold">AI Auto-Triage Adoption:</span>
              <span className="font-mono font-bold text-slate-900">{automationRatePct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              step="5"
              value={automationRatePct}
              onChange={(e) => setAutomationRatePct(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Manual)</span>
              <span>25% (Current)</span>
              <span>80% (Advanced)</span>
            </div>
          </div>
        </div>

        {/* Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Simulated SLA Breach Rate</span>
              <p className={`text-xl font-extrabold font-mono mt-0.5 ${simulatedBreachRate > 6 ? 'text-rose-700' : 'text-slate-900'}`}>
                {simulatedBreachRate}%
              </p>
              <span className="text-[10px] text-slate-400">Baseline: 4.2%</span>
            </div>
            <ShieldAlertIcon size={22} className={simulatedBreachRate > 6 ? 'text-rose-600' : 'text-slate-700'} />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Simulated Avg Turnaround</span>
              <p className="text-xl font-extrabold font-mono text-slate-900 mt-0.5">
                {simulatedAvgLatency} Days
              </p>
              <span className="text-[10px] text-slate-400">Baseline: 6.2 Days</span>
            </div>
            <TrendingUpIcon size={22} className="text-slate-700" />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Readiness Assessment</span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {simulatedStaffRisk}
              </p>
              <span className="text-[10px] text-slate-400">System capacity state</span>
            </div>
            <ActivityIcon size={22} className="text-slate-700" />
          </div>
        </div>
      </div>

      {/* Seasonal Grievance Surges & Live Anomaly Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Seasonal Surges */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon size={16} className="text-slate-700" />
              Seasonal Surge Calendar & Proactive Directives
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Historical cyclical spikes predicted across key scheme categories.
          </p>

          <div className="space-y-2.5 pt-1">
            {SEASONAL_SURGES.map((surge) => (
              <div key={surge.season} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{surge.season} ({surge.months})</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded text-[10px]">
                    {surge.surgePercentage}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Category: {surge.category}</p>
                <div className="p-2 bg-white rounded text-[11px] text-slate-700 border border-slate-200/60">
                  <strong>Action Directive:</strong> {surge.actionMitigation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Statistical Outliers */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangleIcon size={16} className="text-slate-700" />
              Statistical Anomaly Radar (Z-Score &gt; 3.0)
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              3 Active Outliers
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Unusual spikes in specific categories or districts deviating from 90-day moving averages.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Pune District • NHAI Compensation Demand</span>
                <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[10px]">+340% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                142 complaints filed within 48 hours following expressway toll notification and land demarcation.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Patna & Muzaffarpur • Ayushman Card API Gateway</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px]">+185% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Gateway timeout between state portal and National Health Authority node.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Lucknow Hub • DBT Pension Aadhaar Seeding</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-[10px]">+140% Deviation</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Senior citizen pension batch rejection due to bank NPCI mapper sync delay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
