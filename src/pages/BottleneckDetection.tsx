import React, { useState } from 'react';
import {
  AlertOctagon,
  ArrowRight,
  Clock,
  Users,
  Building,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { BOTTLENECKS_DATA } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { KPICard } from '../components/common/KPICard';

export const BottleneckDetection: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(4); // Field verification default

  const filteredBottlenecks = BOTTLENECKS_DATA.filter((b) => {
    if (selectedSeverity !== 'all' && b.severityBadge !== selectedSeverity) return false;
    if (selectedDept !== 'all' && !b.department.toLowerCase().includes(selectedDept.toLowerCase())) return false;
    return true;
  });

  // Chart data: Days lost per department due to systemic bottlenecks
  const bottleneckImpactData = [
    { name: 'Pension (DoPPW)', daysLost: 24500, count: 18400 },
    { name: 'Power (State Discoms)', daysLost: 21200, count: 14200 },
    { name: 'Highways (NHAI)', daysLost: 19800, count: 12900 },
    { name: 'Rural Dev (MGNREGA)', daysLost: 18400, count: 11400 },
    { name: 'Health (NHA / AB-PMJAY)', daysLost: 14600, count: 8200 },
    { name: 'Railways (RailMadad)', daysLost: 4200, count: 3100 },
  ];

  const pipelineSteps = [
    { id: 1, name: '1. Ingestion', status: 'optimal', latency: '< 1 min', desc: 'CPGRAMS Portal / Umang / Call-Center' },
    { id: 2, name: '2. AI Classification', status: 'optimal', latency: '< 5 sec', desc: 'Indic-BERT entity & category mapping' },
    { id: 3, name: '3. Dept Routing', status: 'optimal', latency: '0.4 days', desc: 'Automated nodal officer routing' },
    { id: 4, name: '4. Field Verification', status: 'bottleneck', latency: '14.2 days', desc: 'Manual on-site inspection & Patwari inquiry' },
    { id: 5, name: '5. Sanction Order', status: 'delayed', latency: '6.8 days', desc: 'Drawing & Disbursing Officer approval' },
    { id: 6, name: '6. Disposal & Close', status: 'optimal', latency: '0.8 days', desc: 'Written speaking order uploaded' },
    { id: 7, name: '7. IVRS Citizen Audit', status: 'optimal', latency: 'Live Call', desc: 'Outbound feedback verification' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-200 uppercase tracking-wider flex items-center gap-1">
              <AlertOctagon size={13} className="text-amber-700" />
              Process Mining & Latency Diagnostics
            </span>
            <span className="text-xs text-slate-400 font-mono">Statistical Root-Cause Isolation</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Systemic Bottleneck Detection & Root-Cause Diagnosis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pinpoints the exact structural stages in administrative pipelines where citizen complaints stall, accumulate friction, and breach statutory charters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
            Identified Friction Points: <strong className="text-amber-400">5 Systemic Nodes</strong>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Citizen Cumulative Days Lost"
          value="1,02,700 Days"
          subValue="Across 5 Systemic Bottlenecks"
          icon={<Clock size={18} />}
          accentColor="rose"
          tooltipText="Total citizen wait-time attributable purely to preventable administrative process choke points."
        />
        <KPICard
          title="Primary Choke Stage"
          value="Field Verification"
          subValue="14.2 Days Avg Latency"
          icon={<AlertOctagon size={18} />}
          accentColor="amber"
          tooltipText="Stage responsible for 64% of all SLA charter violations."
        />
        <KPICard
          title="Impacted Citizen Volume"
          value="66,500 Cases"
          subValue="53% of National Caseload"
          icon={<Users size={18} />}
          accentColor="purple"
          tooltipText="Number of citizens directly trapped in bottlenecked procedures."
        />
        <KPICard
          title="Projected Latency Recovery"
          value="-4.8 Days Avg"
          subValue="With Proposed DSS Fixes"
          icon={<Sparkles size={18} />}
          accentColor="emerald"
          tooltipText="Turnaround reduction achievable by implementing recommended structural fixes."
        />
      </div>

      {/* Interactive Process Pipeline Diagram */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            CPGRAMS End-to-End Case Resolution Lifecycle & Friction Pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual process mining map highlighting stages with disproportionate queueing delays.
          </p>
        </div>

        {/* Pipeline horizontal blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipelineSteps.map((step) => {
            const isBottleneck = step.status === 'bottleneck';
            const isDelayed = step.status === 'delayed';
            const isSelected = activeStepHover === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepHover(step.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isBottleneck
                    ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-500/20'
                    : isDelayed
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                } ${isSelected ? 'shadow-md -translate-y-0.5' : ''}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isBottleneck
                        ? 'bg-rose-600 text-white'
                        : isDelayed
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isBottleneck ? 'Choke Node' : isDelayed ? 'Delayed' : 'Fluid'}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{step.latency}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{step.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {activeStepHover === 4 && (
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-150">
            <AlertOctagon size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-rose-950">
                Critical Process Chokepoint: Stage 4 — Physical Field Verification (14.2 Days Latency)
              </h4>
              <p className="text-slate-700 leading-relaxed">
                Field inspections by local Revenue/Discom officers lack digital geotagging tools. Files remain in physical transit for an average of 11 days before report upload.
              </p>
              <p className="text-rose-900 font-semibold pt-0.5">
                Recommended Executive Fix: Deploy mobile CPGRAMS-Field app with automated Geo-Fencing & 48-Hour mandatory SLA countdown.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top 5 Systemic Bottlenecks Detailed Cards */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              Top 5 Systemic Root-Cause Diagnostic Dossiers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by total citizen latency impact, friction volume, and recurring appeal rate.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical Severity</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
            </select>
          </div>
        </div>

        <div className="space-y-3.5">
          {filteredBottlenecks.map((btnk, idx) => (
            <div
              key={btnk.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-white transition-all space-y-3 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{btnk.subDepartment}</h4>
                    <p className="text-[11px] text-slate-500">{btnk.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge type="priority" value={btnk.severityBadge} />
                  <span className="text-xs font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                    Avg Delay: +{btnk.avgDelayDays} Days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Identified Root Cause</span>
                  <p className="text-slate-800 font-medium leading-relaxed">{btnk.rootCause}</p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800">
                    <Lightbulb size={12} />
                    <span>Recommended Structural Fix</span>
                  </div>
                  <p className="text-emerald-950 font-medium leading-relaxed">{btnk.recommendedAction}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <span>
                    Impacted Caseload: <strong className="font-mono text-slate-900">{btnk.pendingLoad.toLocaleString()} Citizens</strong>
                  </span>
                  <span>•</span>
                  <span>
                    SLA Impact: <strong className="font-mono text-emerald-700 font-bold">{btnk.slaImpact}</strong>
                  </span>
                </div>
                <button className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                  Dispatch Directive to Ministry →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cumulative Days Lost by Department Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Cumulative Citizen Days Lost to Administrative Latency</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bottleneckImpactData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `${v / 1000}k d`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                formatter={(val: any) => [`${val.toLocaleString()} citizen days`, 'Lost Latency']}
              />
              <Bar dataKey="daysLost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
