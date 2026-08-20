import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  FileText,
  Calendar,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { IndiaMap } from '../components/common/IndiaMap';
import {
  STATES_DATA,
  RECOMMENDATIONS_DATA,
} from '../data/mockData';
import { GrievanceRecord, StateMetric } from '../types';
import { AppLanguage, TRANSLATIONS } from '../utils/translations';

interface ExecutiveOverviewProps {
  onSelectGrievance: (grv: GrievanceRecord) => void;
  grievances: GrievanceRecord[];
  onNavigateTab: (tab: any) => void;
  language?: AppLanguage;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  onSelectGrievance,
  grievances,
  onNavigateTab,
  language = 'en',
}) => {
  const t = TRANSLATIONS[language];
  const [mapLayer, setMapLayer] = useState<'pending' | 'sla' | 'sentiment' | 'hotspots' | 'volume'>('pending');
  const [selectedState, setSelectedState] = useState<StateMetric | null>(null);

  // Today's formatted date
  const todayDateStr = new Date().toLocaleDateString('en-GB');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Welcoming Hero Title and Geolocation Pill */}
      <div className="space-y-1 pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.welcomeExecutive}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
          <MapPin size={14} className="text-slate-400" />
          <span>{t.locationDelhi}</span>
        </div>
      </div>

      {/* 2. Main Two-Column Row: Left 8-col Map card + Right 4-col 2 clean Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8-Column: Clean Card with Leaflet Map */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.nationalOverview}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('maps')}
                className="text-xs text-slate-700 font-semibold hover:text-slate-950 flex items-center gap-1 cursor-pointer"
              >
                {t.deepDiveGis} <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* Leaflet Map Embed */}
          <IndiaMap
            states={STATES_DATA}
            activeLayer={mapLayer}
            onLayerChange={setMapLayer}
            selectedState={selectedState}
            onSelectState={setSelectedState}
          />
        </div>

        {/* Right 4-Column: 2 Clean Minimalist Metric Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Top Metric Card: SLA Resolution Rate */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <TrendingUp size={22} className="text-slate-800" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                  {t.targetMet}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  88.6%
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {t.slaResolutionRate}
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-slate-900 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '88.6%' }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {t.statutoryCompliance}
              </p>
            </div>
          </div>

          {/* Bottom Metric Card: Total Disposals Volume */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileText size={22} className="text-amber-600" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                  {t.highVolume}
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  1,25,456
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {t.citizenRedressals}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {t.quarterGrowth}
              </span>
              <button
                onClick={() => onNavigateTab('grievances')}
                className="text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
              >
                {t.viewRegistry}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: "Today's Action Plan" / AI Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.todaysActionPlan}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {RECOMMENDATIONS_DATA.length} {t.activeTasks}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Calendar size={14} />
            <span>{todayDateStr}</span>
          </div>
        </div>

        {/* 3 Clean Priority Cards in Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {RECOMMENDATIONS_DATA.slice(0, 3).map((rec, index) => {
            const colors = [
              { bg: 'bg-rose-50/60', border: 'border-rose-100', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800' },
              { bg: 'bg-amber-50/60', border: 'border-amber-100', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800' },
              { bg: 'bg-slate-100/70', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-200 text-slate-800' },
            ][index % 3];

            return (
              <div
                key={rec.id}
                onClick={() => onNavigateTab('recommendations')}
                className={`p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colors.badge}`}>
                      {rec.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {t.impact}: {rec.impact}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-xs font-semibold text-slate-700">
                  <span className="text-[11px] text-slate-500 font-normal">{rec.affectedDepartment}</span>
                  <span className="text-slate-900 flex items-center gap-0.5 group-hover:underline">
                    {t.takeAction} <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
