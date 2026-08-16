import React, { useState } from 'react';
import { MapPin, ShieldAlert, TrendingUp, AlertTriangle, Eye, ArrowRight, Layers } from 'lucide-react';
import { StateMetric, DistrictMetric, RiskLevel } from '../../types';
import { StatusBadge } from './StatusBadge';

interface IndiaMapProps {
  states: StateMetric[];
  activeLayer: 'pending' | 'sla' | 'sentiment' | 'hotspots' | 'volume';
  onLayerChange: (layer: 'pending' | 'sla' | 'sentiment' | 'hotspots' | 'volume') => void;
  selectedState: StateMetric | null;
  onSelectState: (state: StateMetric | null) => void;
  onSelectDistrict?: (district: DistrictMetric) => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  states,
  activeLayer,
  onLayerChange,
  selectedState,
  onSelectState,
  onSelectDistrict,
}) => {
  const [hoveredState, setHoveredState] = useState<StateMetric | null>(null);

  // Helper to calculate fill color based on active layer
  const getStateColor = (state: StateMetric) => {
    if (activeLayer === 'pending') {
      if (state.pendingLoad > 10000) return '#b91c1c'; // dark red
      if (state.pendingLoad > 6000) return '#ea580c'; // orange
      if (state.pendingLoad > 3500) return '#f59e0b'; // amber
      return '#3b82f6'; // blue
    }
    if (activeLayer === 'sla') {
      if (state.slaCompliancePct < 78) return '#b91c1c';
      if (state.slaCompliancePct < 85) return '#f59e0b';
      return '#10b981'; // emerald
    }
    if (activeLayer === 'sentiment') {
      if (state.sentimentScore < -0.3) return '#ef4444';
      if (state.sentimentScore < 0) return '#f97316';
      if (state.sentimentScore < 0.2) return '#3b82f6';
      return '#10b981';
    }
    if (activeLayer === 'hotspots') {
      return state.isPredictedHotspot ? '#9333ea' : '#94a3b8';
    }
    // Volume
    if (state.totalGrievances > 20000) return '#1e3a8a';
    if (state.totalGrievances > 12000) return '#2563eb';
    if (state.totalGrievances > 8000) return '#60a5fa';
    return '#93c5fd';
  };

  // Coordinated schematic geographical grid layout for India's administrative states
  // This ensures high responsiveness, instant zero-lag rendering, perfect touch targets, and rich interactivity
  const stateLayoutPositions: { code: string; name: string; x: number; y: number; width: number; height: number }[] = [
    { code: 'PB', name: 'Punjab', x: 130, y: 70, width: 65, height: 45 },
    { code: 'DL', name: 'Delhi NCT', x: 210, y: 80, width: 65, height: 40 },
    { code: 'RJ', name: 'Rajasthan', x: 90, y: 130, width: 95, height: 75 },
    { code: 'UP', name: 'Uttar Pradesh', x: 200, y: 130, width: 110, height: 65 },
    { code: 'BR', name: 'Bihar', x: 325, y: 140, width: 85, height: 55 },
    { code: 'AS', name: 'Assam', x: 430, y: 130, width: 80, height: 50 },
    { code: 'GJ', name: 'Gujarat', x: 70, y: 220, width: 95, height: 65 },
    { code: 'MP', name: 'Madhya Pradesh', x: 180, y: 210, width: 115, height: 70 },
    { code: 'WB', name: 'West Bengal', x: 310, y: 210, width: 85, height: 65 },
    { code: 'MH', name: 'Maharashtra', x: 130, y: 300, width: 120, height: 80 },
    { code: 'OR', name: 'Odisha', x: 270, y: 290, width: 90, height: 65 },
    { code: 'TS', name: 'Telangana', x: 180, y: 395, width: 90, height: 60 },
    { code: 'KA', name: 'Karnataka', x: 120, y: 400, width: 90, height: 95 },
    { code: 'TN', name: 'Tamil Nadu', x: 170, y: 480, width: 95, height: 90 },
    { code: 'KL', name: 'Kerala', x: 120, y: 510, width: 55, height: 75 },
  ];

  // Ranked high-risk districts across the country
  const allDistricts = states.flatMap((s) => s.districts);
  const highRiskDistricts = [...allDistricts]
    .sort((a, b) => b.pendingLoad - a.pendingLoad)
    .slice(0, 7);

  return (
    <div className="space-y-4">
      {/* Layer Switcher Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Map Analytics Layer:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onLayerChange('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'pending'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending Load
          </button>
          <button
            onClick={() => onLayerChange('sla')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'sla'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            SLA Breaches
          </button>
          <button
            onClick={() => onLayerChange('sentiment')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'sentiment'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Citizen Sentiment
          </button>
          <button
            onClick={() => onLayerChange('hotspots')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'hotspots'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Predicted Hotspots
          </button>
          <button
            onClick={() => onLayerChange('volume')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'volume'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Total Volume
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Ranked District Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Canvas */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin size={16} className="text-blue-600" />
                National Grievance & SLA Geospatial Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any state block to filter live district records and drill down into jurisdictional metrics.
              </p>
            </div>
            {selectedState && (
              <button
                onClick={() => onSelectState(null)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Clear Selection (All India)
              </button>
            )}
          </div>

          {/* SVG Map Schematics */}
          <div className="w-full h-[460px] bg-slate-50/60 rounded-xl border border-slate-200/80 p-2 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 540 600" className="w-full h-full max-h-[440px]">
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="540" height="600" fill="url(#grid)" />

              {/* State Geo Blocks */}
              {stateLayoutPositions.map((pos) => {
                const stateData = states.find((s) => s.stateCode === pos.code);
                if (!stateData) return null;
                const isSelected = selectedState?.stateCode === pos.code;
                const isHovered = hoveredState?.stateCode === pos.code;
                const fillColor = getStateColor(stateData);

                return (
                  <g
                    key={pos.code}
                    onClick={() => onSelectState(isSelected ? null : stateData)}
                    onMouseEnter={() => setHoveredState(stateData)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={pos.width}
                      height={pos.height}
                      rx={8}
                      fill={fillColor}
                      stroke={isSelected ? '#0f172a' : isHovered ? '#ffffff' : '#e2e8f0'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                      opacity={isSelected || isHovered ? 1 : 0.88}
                      className="transition-all hover:opacity-100 drop-shadow-xs"
                    />
                    {/* State Code Label */}
                    <text
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2 - 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="system-ui"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {pos.code}
                    </text>
                    {/* Value Badge */}
                    <text
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2 + 12}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="600"
                      fontFamily="monospace"
                      className="pointer-events-none opacity-90"
                    >
                      {activeLayer === 'pending'
                        ? `${(stateData.pendingLoad / 1000).toFixed(1)}k`
                        : activeLayer === 'sla'
                        ? `${stateData.slaCompliancePct}%`
                        : activeLayer === 'sentiment'
                        ? `${stateData.sentimentScore > 0 ? '+' : ''}${stateData.sentimentScore}`
                        : `${(stateData.totalGrievances / 1000).toFixed(1)}k`}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredState && (
              <div className="absolute top-4 right-4 bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl text-xs w-64 border border-slate-700 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-white">{hoveredState.stateName}</span>
                  <StatusBadge type="risk" value={hoveredState.riskLevel} />
                </div>
                <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Pending Load:</span>
                    <span className="text-white font-bold">{hoveredState.pendingLoad.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Compliance:</span>
                    <span className="text-emerald-400 font-bold">{hoveredState.slaCompliancePct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Breaches:</span>
                    <span className="text-rose-400 font-bold">{hoveredState.slaBreaches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Resolution:</span>
                    <span className="text-white">{hoveredState.avgResolutionDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentiment Index:</span>
                    <span className={hoveredState.sentimentScore > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {hoveredState.sentimentScore > 0 ? `+${hoveredState.sentimentScore}` : hoveredState.sentimentScore}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span>Optimal (SLA &gt;88%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span>Moderate Load</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600 inline-block"></span>
                <span>Critical Backlog / High Breaches</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600 inline-block"></span>
                <span>AI Predicted Hotspot</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-400">15 Active State Commands</span>
          </div>
        </div>

        {/* High-Risk Districts Panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-rose-600" />
                Ranked High-Risk Districts
              </h3>
              <span className="text-[11px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-semibold border border-rose-200">
                Top Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Districts with highest pending load, severe SLA latency, and negative sentiment scores.
            </p>

            {/* List */}
            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {highRiskDistricts.map((dist, idx) => (
                <div
                  key={dist.districtName}
                  onClick={() => onSelectDistrict?.(dist)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                          {dist.districtName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 ml-7">{dist.stateName}</span>
                    </div>
                    <StatusBadge type="risk" value={dist.riskLevel} />
                  </div>

                  <div className="mt-2 ml-7 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                    <div>Pending: <span className="font-bold text-slate-900">{dist.pendingLoad.toLocaleString()}</span></div>
                    <div>SLA: <span className={`font-bold ${dist.slaCompliancePct < 75 ? 'text-rose-600' : 'text-slate-800'}`}>{dist.slaCompliancePct}%</span></div>
                  </div>

                  <div className="mt-1.5 ml-7 text-[11px] text-slate-500 truncate">
                    Top Issue: <span className="text-slate-700">{dist.topIssue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 7 priority districts</span>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">View full registry →</span>
          </div>
        </div>
      </div>

      {/* Selected State Drilldown Table if state selected */}
      {selectedState && (
        <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                Jurisdiction Drilldown
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedState.stateName} — District Command Benchmarks
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span>Total Volume: <strong>{selectedState.totalGrievances.toLocaleString()}</strong></span>
              <span>Pending: <strong className="text-rose-600">{selectedState.pendingLoad.toLocaleString()}</strong></span>
              <span>SLA Compliance: <strong className="text-emerald-600">{selectedState.slaCompliancePct}%</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Pending Load</th>
                  <th className="py-2.5 px-3">Resolved</th>
                  <th className="py-2.5 px-3">Resolution Rate</th>
                  <th className="py-2.5 px-3">SLA Compliance</th>
                  <th className="py-2.5 px-3">Avg Days</th>
                  <th className="py-2.5 px-3">Top Primary Issue</th>
                  <th className="py-2.5 px-3">Nodal Custodian</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedState.districts.map((d) => (
                  <tr key={d.districtName} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{d.districtName}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-rose-700">{d.pendingLoad.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-700">{d.resolvedCount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{d.resolutionRatePct}%</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">{d.slaCompliancePct}%</td>
                    <td className="py-2.5 px-3 font-mono">{d.avgResolutionDays} d</td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-xs">{d.topIssue}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{d.nodalOfficer}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="risk" value={d.riskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
