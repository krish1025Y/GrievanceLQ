import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  TrendingDown,
  ArrowUpRight,
  Filter,
  Search,
  BellRing,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';
import { GrievanceRecord, SLABreachAlert } from '../types';
import { SLA_ALERTS_DATA } from '../data/mockData';

interface SLAMonitoringProps {
  grievances: GrievanceRecord[];
  onSelectGrievance: (grv: GrievanceRecord) => void;
  onEscalateGrievance?: (id: string) => void;
}

export const SLAMonitoring: React.FC<SLAMonitoringProps> = ({
  grievances,
  onSelectGrievance,
  onEscalateGrievance,
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'critical' | 'atRisk' | 'breached'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerSecond, setTickerSecond] = useState(0);

  // Live timer tick every 10 seconds to simulate real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerSecond((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter cases with tight SLA
  const slaCases = grievances.filter((g) => {
    if (g.status === 'Resolved' || g.status === 'Closed') return false;
    if (activeStatusFilter === 'critical' && g.slaStatus !== 'Critical') return false;
    if (activeStatusFilter === 'atRisk' && g.slaStatus !== 'At Risk') return false;
    if (activeStatusFilter === 'breached' && g.slaStatus !== 'Breached') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.registrationNumber.toLowerCase().includes(q) ||
        g.department.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const breachedCount = grievances.filter((g) => g.slaStatus === 'Breached').length;
  const criticalCount = grievances.filter((g) => g.slaStatus === 'Critical').length;
  const atRiskCount = grievances.filter((g) => g.slaStatus === 'At Risk').length;
  const onTrackCount = grievances.filter((g) => g.slaStatus === 'On Track').length;

  const formatCountdown = (mins: number) => {
    if (mins <= 0) return '00h 00m (BREACHED)';
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours < 10 ? '0' : ''}${hours}h ${m < 10 ? '0' : ''}${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* SLA Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded border border-rose-200 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              Live SLA Radar
            </span>
            <span className="text-xs text-slate-400 font-mono">CPGRAMS Statutory Standards</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Real-Time SLA & Escalation Command Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active tracking of citizen service charter compliance, countdown triggers, and breach prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono">
            Radar Refresh: <span className="text-emerald-400 font-bold">10s Cycle Active</span>
          </div>
        </div>
      </div>

      {/* Top 5 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <KPICard
          title="SLA Compliance Rate"
          value="88.6%"
          changePct={3.4}
          progressPct={88.6}
          icon={<CheckCircle size={18} />}
          accentColor="emerald"
          tooltipText="Percentage of total caseload resolved strictly within statutory window."
        />
        <KPICard
          title="Active SLA Caseload"
          value="45,632"
          changePct={-4.2}
          isInverseMetric={true}
          icon={<Clock size={18} />}
          accentColor="blue"
          tooltipText="Total pending complaints with active SLA clocks ticking."
        />
        <KPICard
          title="Breached Violations"
          value={breachedCount > 0 ? `${breachedCount * 180 + 348}` : '1,248'}
          changePct={-12.4}
          isInverseMetric={true}
          icon={<AlertTriangle size={18} />}
          accentColor="rose"
          tooltipText="Grievances that exceeded the maximum 30-day mandate."
        />
        <KPICard
          title="Cases At Risk (<48h)"
          value={atRiskCount > 0 ? `${atRiskCount * 95 + 1420}` : '3,280'}
          changePct={-5.1}
          isInverseMetric={true}
          icon={<Flame size={18} />}
          accentColor="amber"
          tooltipText="Approaching SLA deadline within next 48 hours."
        />
        <KPICard
          title="Avg. Remaining Buffer"
          value="4d 18h"
          subValue="Charter: 30d"
          icon={<Clock size={18} />}
          accentColor="slate"
          tooltipText="Average time buffer across all unbreached active cases."
        />
      </div>

      {/* Grid: Main Table + Right Breach Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large SLA Table */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} className="text-amber-600" />
                Active Grievance SLA Countdown Registry
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sortable and actionable cases ranked by imminent breach risk.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeStatusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                All Active ({slaCases.length})
              </button>
              <button
                onClick={() => setActiveStatusFilter('critical')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeStatusFilter === 'critical' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-800'
                }`}
              >
                Critical (&lt;2h)
              </button>
              <button
                onClick={() => setActiveStatusFilter('atRisk')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeStatusFilter === 'atRisk' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
                }`}
              >
                At Risk
              </button>
              <button
                onClick={() => setActiveStatusFilter('breached')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeStatusFilter === 'breached' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
                }`}
              >
                Breached
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, department, district, or keyword..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Grievance Record</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">SLA Status</th>
                  <th className="py-2.5 px-3 font-mono">Remaining Countdown</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Predicted Risk</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slaCases.slice(0, 12).map((grv) => (
                  <tr
                    key={grv.id}
                    onClick={() => onSelectGrievance(grv)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3">
                      <p className="font-mono font-bold text-blue-700">{grv.registrationNumber}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{grv.subject}</p>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-[140px] truncate">{grv.department}</td>
                    <td className="py-2.5 px-3 text-slate-600">{grv.district}, {grv.state}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="sla" value={grv.slaStatus} />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          grv.slaStatus === 'Breached'
                            ? 'bg-rose-100 text-rose-800 font-extrabold'
                            : grv.slaStatus === 'Critical'
                            ? 'bg-orange-100 text-orange-900 font-extrabold animate-pulse'
                            : grv.slaStatus === 'At Risk'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        <Clock size={11} />
                        {formatCountdown(grv.slaRemainingMinutes)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="priority" value={grv.priority} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="risk" value={grv.predictedRisk} />
                    </td>
                    <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectGrievance(grv)}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right-Side Live Breach Alert Feed */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BellRing size={16} className="text-rose-600 animate-bounce" />
                Real-Time Breach Alerts
              </h3>
              <span className="text-[11px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                Live Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Automated notifications generated by the SLA countdown engine.
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {/* Highlight alert item 1 */}
              <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 border-l-4 border-l-rose-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-rose-800 text-xs">CPG-2026-MH-10293</span>
                  <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded">
                    18 MINS TO BREACH
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 mt-1">
                  GRV-10293 will breach SLA in 18 minutes.
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Delayed Land Compensation at Pune (NHAI). High Court expedited case order.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Officer: Dr. R. Sharma</span>
                  <button
                    onClick={() => {
                      const match = grievances.find((g) => g.id === 'grv-10293');
                      if (match) onSelectGrievance(match);
                    }}
                    className="text-blue-700 font-bold hover:underline"
                  >
                    Direct Intervene →
                  </button>
                </div>
              </div>

              {/* Alert item 2 */}
              <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 border-l-4 border-l-orange-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-orange-800 text-xs">SYSTEM ALERT</span>
                  <span className="text-[10px] text-slate-500 font-mono">4 mins ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  12 high-priority grievances approaching breach window within 2 hours.
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Concentrated primarily in Uttar Pradesh (Rural Development) and Bihar (Health NHA).
                </p>
              </div>

              {/* Alert item 3 */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 border-l-4 border-l-amber-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-amber-900 text-xs">DEPARTMENT DRIFT</span>
                  <span className="text-[10px] text-slate-500 font-mono">15 mins ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  NHAI has recorded 24 SLA violations today.
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Average resolution latency in Land Acquisition compensation increased by +3.8 days.
                </p>
              </div>

              {/* Alert item 4 */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 border-l-4 border-l-blue-600">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-blue-900 text-xs">COMPLIANCE MILESTONE</span>
                  <span className="text-[10px] text-slate-500 font-mono">1 hour ago</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  Railway Board achieved 96.1% SLA compliance for passenger care.
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Fastest disposal turnaround recorded at 1.8 days average.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Escalation Rule: Auto-Summons @ T-30m</span>
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">Config Rules →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
