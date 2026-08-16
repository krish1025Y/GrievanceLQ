import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  CheckCircle2,
  Sliders,
  XCircle,
  Building,
  TrendingDown,
  Smile,
  ShieldCheck,
  Zap,
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { RECOMMENDATIONS_DATA } from '../data/mockData';
import { RecommendationItem } from '../types';
import { KPICard } from '../components/common/KPICard';
import confetti from 'canvas-confetti';

export const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(RECOMMENDATIONS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [simulationModalRec, setSimulationModalRec] = useState<RecommendationItem | null>(null);

  const handleAcceptDirective = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Accepted' } : r))
    );
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Dismissed' } : r))
    );
  };

  const handleResetAll = () => {
    setRecommendations(RECOMMENDATIONS_DATA);
  };

  const filtered = recommendations.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (selectedImpact !== 'all' && r.impact !== selectedImpact) return false;
    return true;
  });

  const acceptedCount = recommendations.filter((r) => r.status === 'Accepted').length;
  const pendingCount = recommendations.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-emerald-600" />
              Executive Decision Support System (DSS)
            </span>
            <span className="text-xs text-slate-400 font-mono">Actionable Policy Intelligence</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Executive Recommendations & Policy Directives
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-synthesized operational directives calibrated for maximum grievance latency reduction and systemic governance reform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
            Directives Dispatched: <strong className="text-emerald-400">{acceptedCount} of {recommendations.length}</strong>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Directives"
          value={`${pendingCount} Pending`}
          subValue="Awaiting Cabinet Nod"
          icon={<Lightbulb size={18} />}
          accentColor="amber"
          tooltipText="Synthesized recommendations ready for executive authorization."
        />
        <KPICard
          title="Estimated Latency Impact"
          value="-3.4 Days"
          subValue="National Turnaround"
          icon={<TrendingDown size={18} />}
          accentColor="blue"
          tooltipText="Projected reduction in average grievance resolution turnaround."
        />
        <KPICard
          title="Projected Satisfaction Boost"
          value="+6.8%"
          subValue="Citizen Approval"
          icon={<Smile size={18} />}
          accentColor="emerald"
          tooltipText="Estimated improvement in citizen satisfaction post-implementation."
        />
        <KPICard
          title="Directives Executed"
          value={`${acceptedCount} Orders`}
          subValue="Transmitted to Ministries"
          icon={<CheckCircle2 size={18} />}
          accentColor="purple"
          tooltipText="Approved actions dispatched to concerned nodal secretariats."
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase text-[11px]">Filter Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Domains</option>
              <option value="Resource Allocation">Resource Allocation</option>
              <option value="Process Automation">Process Automation</option>
              <option value="Field Logistics">Field Logistics</option>
              <option value="Citizen Communication">Citizen Communication</option>
              <option value="Special Taskforce">Special Taskforce</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase text-[11px]">Impact:</span>
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="all">All Impact Levels</option>
              <option value="High">High Impact</option>
              <option value="Medium">Medium Impact</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleResetAll}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Reset Directives
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filtered.map((rec, idx) => {
          const isAccepted = rec.status === 'Accepted';
          const isDismissed = rec.status === 'Dismissed';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all ${
                isAccepted
                  ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-500/30'
                  : isDismissed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 shadow-2xs hover:shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                      {rec.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                      Impact: {rec.impact}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      Effort: {rec.effort}
                    </span>
                    {isAccepted && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                        <CheckCircle2 size={12} /> Directive Dispatched
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{rec.department}</p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Analytical Rationale</span>
                    <p className="text-slate-800 leading-relaxed">{rec.rationale}</p>
                  </div>
                </div>

                {/* Right Action Block */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Projected Outcome</span>
                    <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1">
                      <Zap size={14} className="text-amber-500" />
                      {rec.projectedImpact}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    {!isAccepted && !isDismissed ? (
                      <>
                        <button
                          onClick={() => handleAcceptDirective(rec.id)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          Accept & Dispatch Directive
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSimulationModalRec(rec)}
                            className="flex-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                          >
                            Simulate Impact
                          </button>
                          <button
                            onClick={() => handleDismiss(rec.id)}
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 text-slate-500 rounded-lg text-xs transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </>
                    ) : isAccepted ? (
                      <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg text-center font-bold text-xs">
                        Official Directive Dispatched to Concerned Secretary
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcceptDirective(rec.id)}
                        className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Re-Open Directive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Modal */}
      {simulationModalRec && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Digital Twin Impact Simulation</h3>
              </div>
              <button onClick={() => setSimulationModalRec(null)} className="text-slate-400 hover:text-slate-700">
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-slate-900">{simulationModalRec.title}</p>
              <p className="text-slate-600">{simulationModalRec.rationale}</p>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Latency Gain</span>
                  <p className="text-base font-bold text-emerald-600">-3.8 Days Average</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Implementation Risk</span>
                  <p className="text-base font-bold text-blue-600">Low (Policy Circular)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSimulationModalRec(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Simulation
              </button>
              <button
                onClick={() => {
                  handleAcceptDirective(simulationModalRec.id);
                  setSimulationModalRec(null);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
              >
                Accept Directive Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
