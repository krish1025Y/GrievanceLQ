import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, RotateCcw, AlertTriangle, ShieldCheck, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { StateMetric, DistrictMetric } from '../../types';
import { StatusBadge } from './StatusBadge';

// Explicit Leaflet Tile provider with no API key requirement (OpenStreetMap standard / CartoDB clean tiles)
const MAP_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Geocoordinates for Indian States & Major Districts
const STATE_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  MH: { lat: 19.7515, lng: 75.7139, zoom: 6 },
  UP: { lat: 26.8467, lng: 80.9462, zoom: 6 },
  DL: { lat: 28.7041, lng: 77.1025, zoom: 9 },
  KA: { lat: 15.3173, lng: 75.7139, zoom: 6 },
  TN: { lat: 11.1271, lng: 78.6569, zoom: 6 },
  GJ: { lat: 22.2587, lng: 71.1924, zoom: 6 },
  RJ: { lat: 27.0238, lng: 74.2179, zoom: 6 },
  WB: { lat: 22.9868, lng: 87.8550, zoom: 6 },
  MP: { lat: 22.9734, lng: 78.6569, zoom: 6 },
  BR: { lat: 25.0961, lng: 85.3131, zoom: 6 },
  TS: { lat: 18.1124, lng: 79.0193, zoom: 6 },
  KL: { lat: 10.8505, lng: 76.2711, zoom: 6 },
  PB: { lat: 31.1471, lng: 75.3412, zoom: 7 },
  OR: { lat: 20.9517, lng: 85.0985, zoom: 6 },
  AS: { lat: 26.2006, lng: 92.9376, zoom: 6 },
};

const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Mumbai Suburban': { lat: 19.0760, lng: 72.8777 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kanpur Nagar': { lat: 26.4499, lng: 80.3319 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Prayagraj': { lat: 25.4358, lng: 81.8463 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Central Delhi': { lat: 28.6448, lng: 77.2167 },
  'South Delhi': { lat: 28.4817, lng: 77.1873 },
  'East Delhi': { lat: 28.6277, lng: 77.2950 },
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946 },
  'Mysuru': { lat: 12.2958, lng: 76.6394 },
  'Dharwad': { lat: 15.4589, lng: 75.0078 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Howrah': { lat: 22.5958, lng: 88.2636 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Gaya': { lat: 24.7914, lng: 85.0002 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  'Ernakulam': { lat: 9.9816, lng: 76.2999 },
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Khordha (Bhubaneswar)': { lat: 20.2961, lng: 85.8245 },
  'Kamrup Metropolitan (Guwahati)': { lat: 26.1445, lng: 91.7362 },
};

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Helper to calculate marker color based on active layer (using professional, restrained hues)
  const getMetricColor = (state: StateMetric) => {
    if (activeLayer === 'pending') {
      if (state.pendingLoad > 10000) return '#7f1d1d'; // dark wine
      if (state.pendingLoad > 6000) return '#b45309'; // warm amber
      if (state.pendingLoad > 3500) return '#0369a1'; // slate ocean
      return '#0b3c6d'; // official portal navy
    }
    if (activeLayer === 'sla') {
      if (state.slaCompliancePct < 78) return '#7f1d1d';
      if (state.slaCompliancePct < 85) return '#b45309';
      return '#047857'; // emerald
    }
    if (activeLayer === 'sentiment') {
      if (state.sentimentScore < -0.3) return '#7f1d1d';
      if (state.sentimentScore < 0) return '#b45309';
      return '#047857';
    }
    if (activeLayer === 'hotspots') {
      return state.isPredictedHotspot ? '#581c87' : '#64748b';
    }
    // Volume
    return '#0b3c6d';
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.5, 78.9],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        zoomControl: false,
      });

      L.tileLayer(MAP_TILE_URL, {
        attribution: MAP_ATTRIBUTION,
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Leaflet Markers when layer, selection, or data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (selectedState) {
      // Focus on state and render District markers
      const stateCoord = STATE_COORDINATES[selectedState.stateCode] || { lat: 20.5937, lng: 78.9629, zoom: 6 };
      map.setView([stateCoord.lat, stateCoord.lng], stateCoord.zoom, { animate: true });

      selectedState.districts.forEach((dist) => {
        const coords = DISTRICT_COORDINATES[dist.districtName] || {
          lat: stateCoord.lat + (Math.random() - 0.5) * 1.5,
          lng: stateCoord.lng + (Math.random() - 0.5) * 1.5,
        };

        const markerColor = dist.riskLevel === 'Critical' ? '#7f1d1d' : dist.riskLevel === 'High' ? '#b45309' : '#0b3c6d';

        const customIcon = L.divIcon({
          className: 'leaflet-custom-marker',
          html: `
            <div style="background-color: ${markerColor}; width: 28px; height: 28px; border-radius: 9999px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; font-family: monospace;">
              ${dist.pendingLoad > 999 ? (dist.pendingLoad / 1000).toFixed(0) + 'k' : dist.pendingLoad}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(markersGroup);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 170px; padding: 2px;">
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 3px;">${dist.districtName}</div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${selectedState.stateName} Jurisdiction</div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #64748b;">Pending Load:</span>
              <strong style="color: #0f172a;">${dist.pendingLoad.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #64748b;">SLA Compliance:</span>
              <strong style="color: ${dist.slaCompliancePct > 80 ? '#047857' : '#b45309'};">${dist.slaCompliancePct}%</strong>
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              Primary: ${dist.topIssue}
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectDistrict) onSelectDistrict(dist);
        });
      });
    } else {
      // National View: Render State Circle Markers
      map.setView([22.5, 78.9], 5, { animate: true });

      states.forEach((st) => {
        const coords = STATE_COORDINATES[st.stateCode];
        if (!coords) return;

        const color = getMetricColor(st);

        const customIcon = L.divIcon({
          className: 'leaflet-state-marker',
          html: `
            <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 8px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; cursor: pointer; transition: transform 0.15s;">
              <span style="font-weight: 700; font-size: 10px; line-height: 1;">${st.stateCode}</span>
              <span style="font-size: 8px; font-family: monospace; opacity: 0.9;">${(st.pendingLoad / 1000).toFixed(1)}k</span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(markersGroup);

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 180px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 13px; color: #0f172a;">${st.stateName}</strong>
              <span style="font-size: 10px; background: #f1f5f9; padding: 1px 4px; border-radius: 4px; font-weight: 600; color: #334155;">${st.riskLevel}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #64748b;">Pending Cases:</span>
              <strong style="color: #0f172a;">${st.pendingLoad.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span style="color: #64748b;">SLA Compliance:</span>
              <strong style="color: ${st.slaCompliancePct > 85 ? '#047857' : '#b45309'};">${st.slaCompliancePct}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="color: #64748b;">SLA Breaches:</span>
              <strong style="color: #7f1d1d;">${st.slaBreaches}</strong>
            </div>
            <div style="font-size: 10px; text-align: center; color: #0b3c6d; font-weight: 600; padding-top: 4px; border-top: 1px solid #e2e8f0; cursor: pointer;">
              Click marker to focus jurisdiction →
            </div>
          </div>
        `);

        marker.on('click', () => {
          onSelectState(st);
        });
      });
    }
  }, [states, activeLayer, selectedState]);

  // Ranked high-risk districts across the country
  const allDistricts = states.flatMap((s) => s.districts);
  const highRiskDistricts = [...allDistricts]
    .sort((a, b) => b.pendingLoad - a.pendingLoad)
    .slice(0, 7);

  return (
    <div className="space-y-4">
      {/* Map Analytics Layer Switcher Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-slate-700" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Map Layer:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onLayerChange('pending')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'pending'
                ? 'bg-[#0b3c6d] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending Backlog
          </button>
          <button
            onClick={() => onLayerChange('sla')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'sla'
                ? 'bg-[#0b3c6d] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            SLA Compliance
          </button>
          <button
            onClick={() => onLayerChange('sentiment')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'sentiment'
                ? 'bg-[#0b3c6d] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Citizen Sentiment
          </button>
          <button
            onClick={() => onLayerChange('hotspots')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'hotspots'
                ? 'bg-[#0b3c6d] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Predicted Hotspots
          </button>
          <button
            onClick={() => onLayerChange('volume')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeLayer === 'volume'
                ? 'bg-[#0b3c6d] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Total Caseload
          </button>
        </div>
      </div>

      {/* Main Grid: Leaflet Geospatial View + Ranked District Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin size={15} className="text-[#0b3c6d]" />
                Interactive Geospatial Leaflet Intelligence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any jurisdictional node to zoom into district caseloads and SLA thresholds.
              </p>
            </div>
            {selectedState && (
              <button
                onClick={() => onSelectState(null)}
                className="text-xs text-[#0b3c6d] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                Reset (All India)
              </button>
            )}
          </div>

          {/* Leaflet DOM Node */}
          <div className="w-full h-[460px] rounded-lg border border-slate-200 overflow-hidden relative z-10">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Custom Leaflet Zoom Overlay Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1 shadow-md rounded-lg overflow-hidden border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="p-2 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                type="button"
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="p-2 hover:bg-slate-100 text-slate-700 transition-colors border-t border-slate-100 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">Indicators:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#047857]"></span>
                <span>Compliant (&gt;85%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span>
                <span>Moderate / Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7f1d1d]"></span>
                <span>Critical Backlog</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              {selectedState ? `${selectedState.stateName} (${selectedState.districts.length} Districts)` : 'National Overview (15 Hubs)'}
            </span>
          </div>
        </div>

        {/* High-Risk Districts Panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-slate-700" />
                Ranked Backlog Districts
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                Priority Caseload
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Districts with highest active caseload and pending redressal timelines.
            </p>

            {/* List */}
            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {highRiskDistricts.map((dist, idx) => (
                <div
                  key={dist.districtName}
                  onClick={() => onSelectDistrict?.(dist)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#0b3c6d]">
                          {dist.districtName}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 ml-7">{dist.stateName}</span>
                    </div>
                    <StatusBadge type="risk" value={dist.riskLevel} />
                  </div>

                  <div className="mt-1.5 ml-7 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                    <div>Pending: <span className="font-bold text-slate-900">{dist.pendingLoad.toLocaleString()}</span></div>
                    <div>SLA: <span className="font-bold text-slate-800">{dist.slaCompliancePct}%</span></div>
                  </div>

                  <div className="mt-1 ml-7 text-[11px] text-slate-500 truncate">
                    Top Issue: <span className="text-slate-700">{dist.topIssue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Displaying 7 highest caseload districts</span>
          </div>
        </div>
      </div>

      {/* Selected State Drilldown Table if state selected */}
      {selectedState && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase border border-slate-200">
                Jurisdiction Drilldown
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedState.stateName} — District Command Benchmarks
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
              <span>Total Volume: <strong className="text-slate-900">{selectedState.totalGrievances.toLocaleString()}</strong></span>
              <span>Pending: <strong className="text-slate-900">{selectedState.pendingLoad.toLocaleString()}</strong></span>
              <span>SLA Compliance: <strong className="text-[#047857]">{selectedState.slaCompliancePct}%</strong></span>
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
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{d.pendingLoad.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{d.resolvedCount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono">{d.resolutionRatePct}%</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#047857]">{d.slaCompliancePct}%</td>
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
