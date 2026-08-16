import React, { useState } from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Sparkles, Filter, ChevronRight, Activity, Layers, ArrowUpRight } from 'lucide-react';
import { IndiaMap } from '../components/common/IndiaMap';
import { STATES_DATA } from '../data/mockData';
import { StateMetric, DistrictMetric } from '../types';
import { KPICard } from '../components/common/KPICard';
import { StatusBadge } from '../components/common/StatusBadge';

interface DistrictIntelligenceProps {
  onSelectDistrictCase?: (districtName: string) => void;
  onNavigateToGrievances?: () => void;
}

export const DistrictIntelligence: React.FC<DistrictIntelligenceProps> = ({
  onSelectDistrictCase,
  onNavigateToGrievances,
}) => {
  const [activeLayer, setActiveLayer] = useState<'pending' | 'sla' | 'sentiment' | 'hotspots' | 'volume'>('pending');
  const [selectedState, setSelectedState] = useState<StateMetric | null>(STATES_DATA[0]); // Maharashtra default
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<DistrictMetric | null>(null);

  // Summary counts
  const totalHotspots = STATES_DATA.filter((s) => s.isPredictedHotspot).length;
  const criticalStates = STATES_DATA.filter((s) => s.riskLevel === 'Critical').length;
  const totalStatesTracked = STATES_DATA.length;
  const totalNationalPending = STATES_DATA.reduce((acc, s) => acc + s.pendingLoad, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={13} className="text-[#0b3c6d]" />
              National Geospatial Maps
            </span>
            <span className="text-xs text-slate-500 font-mono">{totalStatesTracked} State Hubs • 780+ Districts</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Geospatial Intelligence & Jurisdictional Hotspots
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive Leaflet map analytics for tracking pending caseloads, SLA adherence, and regional hotspots.
          </p>
        </div>

        {/* State Quick Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="state-quick-select" className="text-xs font-semibold text-slate-600 shrink-0">
            Focus State:
          </label>
          <select
            id="state-quick-select"
            value={selectedState?.stateCode || ''}
            onChange={(e) => {
              const st = STATES_DATA.find((s) => s.stateCode === e.target.value);
              setSelectedState(st || null);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            <option value="">All India (National View)</option>
            {STATES_DATA.map((st) => (
              <option key={st.stateCode} value={st.stateCode}>
                {st.stateName} ({st.pendingLoad.toLocaleString()} pending)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Geospatial KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monitored Districts"
          value="780+"
          subValue="Across 36 States/UTs"
          icon={<MapPin size={18} />}
          accentColor="blue"
          tooltipText="Total jurisdictional district administrations synchronized with CPGRAMS."
        />
        <KPICard
          title="Highest Backlog State"
          value="Uttar Pradesh"
          subValue="11,840 Pending Cases"
          icon={<AlertTriangle size={18} />}
          accentColor="rose"
          tooltipText="State with highest concentrated active grievance backlog."
        />
        <KPICard
          title="Top SLA Performer"
          value="Gujarat"
          subValue="92.1% SLA Compliant"
          icon={<ShieldCheck size={18} />}
          accentColor="emerald"
          tooltipText="State administration achieving highest on-time disposal velocity."
        />
        <KPICard
          title="AI Hotspot Clusters"
          value={`${totalHotspots} States`}
          subValue="Surge Forecast Active"
          icon={<Sparkles size={18} />}
          accentColor="purple"
          tooltipText="Regions projected to experience >20% grievance volume surge in next 30 days."
        />
      </div>

      {/* Interactive India Geospatial Map */}
      <IndiaMap
        states={STATES_DATA}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        selectedState={selectedState}
        onSelectState={setSelectedState}
        onSelectDistrict={(dist) => setSelectedDistrictModal(dist)}
      />

      {/* District Detail Modal if clicked */}
      {selectedDistrictModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                  District Intelligence Profile
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedDistrictModal.districtName}, {selectedDistrictModal.stateName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Ingested</span>
                  <p className="text-sm font-bold text-slate-900 font-mono">
                    {selectedDistrictModal.totalGrievances.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Pending Backlog</span>
                  <p className="text-sm font-bold text-rose-700 font-mono">
                    {selectedDistrictModal.pendingLoad.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">SLA Compliance</span>
                  <p className="text-sm font-bold text-emerald-700 font-mono">
                    {selectedDistrictModal.slaCompliancePct}%
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Avg Latency</span>
                  <p className="text-sm font-bold text-slate-900 font-mono">
                    {selectedDistrictModal.avgResolutionDays} days
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
                <span className="text-[11px] font-bold text-blue-900 uppercase">Primary Root Grievance Issue</span>
                <p className="text-xs text-blue-950 font-medium">{selectedDistrictModal.topIssue}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Designated Nodal Custodian</span>
                <p className="text-xs text-slate-900 font-bold">{selectedDistrictModal.nodalOfficer}</p>
                <p className="text-[11px] text-slate-500">District Magistrate Secretariat</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              {onNavigateToGrievances && (
                <button
                  onClick={() => {
                    setSelectedDistrictModal(null);
                    onNavigateToGrievances();
                  }}
                  className="px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  Filter Grievances →
                </button>
              )}
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 ml-auto cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
