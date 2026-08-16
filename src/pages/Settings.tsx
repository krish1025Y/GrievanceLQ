import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Layers,
  Database,
  Radio,
  Bell,
  Users,
  Key,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Sparkles,
  Server,
  Lock
} from 'lucide-react';
import { INTEGRATION_STATUSES, AUDIT_LOGS } from '../data/mockData';
import { KPICard } from '../components/common/KPICard';

export const SettingsPage: React.FC = () => {
  const [slaDays, setSlaDays] = useState(30);
  const [autoEscalateHours, setAutoEscalateHours] = useState(48);
  const [sentimentThreshold, setSentimentThreshold] = useState('0.65');
  const [enableVoiceIVRS, setEnableVoiceIVRS] = useState(true);
  const [enableAutoSummons, setEnableAutoSummons] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'users' | 'audit'>('general');
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded border border-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Settings size={13} className="text-slate-700" />
              Administrative Governance
            </span>
            <span className="text-xs text-slate-400 font-mono">CPGRAMS 7.0 Platform Engine</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            System Configuration, Integrations & Governance Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure statutory SLA thresholds, AI triage parameters, external gateway connections, and role-based access control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 size={13} /> Parameters Updated
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'general' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          SLA & AI Parameters
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'integrations' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          National Gateways & Integrations ({INTEGRATION_STATUSES.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Role-Based Access Control (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Security & Audit Logs
        </button>
      </div>

      {/* Tab 1: SLA & AI Parameters */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-blue-600" />
              Statutory SLA & Escalation Rules
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Standard Statutory Citizen Charter SLA:</span>
                  <span className="font-mono font-bold text-blue-700">{slaDays} Calendar Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="60"
                  value={slaDays}
                  onChange={(e) => setSlaDays(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  DARPG default statutory resolution mandate for public grievances.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Automated Warning Countdown Trigger:</span>
                  <span className="font-mono font-bold text-amber-700">{autoEscalateHours} Hours Before Breach</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  step="6"
                  value={autoEscalateHours}
                  onChange={(e) => setAutoEscalateHours(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Dispatches SMS & portal notifications to the assigned Nodal Officer and District Magistrate.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableAutoSummons}
                    onChange={(e) => setEnableAutoSummons(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-800 font-medium">
                    Auto-Summons Escalation to Secretary level on T-0 Breach
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableVoiceIVRS}
                    onChange={(e) => setEnableVoiceIVRS(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-800 font-medium">
                    Outbound automated IVRS confirmation call upon case disposal
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              Machine Learning & NLP Configuration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Indic-BERT Semantic Sentiment Confidence Threshold:
                </label>
                <select
                  value={sentimentThreshold}
                  onChange={(e) => setSentimentThreshold(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                >
                  <option value="0.50">0.50 — Broad Sensitivity (Higher recall)</option>
                  <option value="0.65">0.65 — Balanced Precision (Default)</option>
                  <option value="0.80">0.80 — High Confidence (Lower false positives)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Predictive Anomaly Deviation Sensitivity (Z-Score):
                </label>
                <input
                  type="text"
                  disabled
                  value="3.0 Standard Deviations (Outlier Detection)"
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-800">Active Inference Engine</span>
                <p className="text-xs text-purple-950">
                  Model Version: <strong>Indic-CPGRAMS-v3.4-LLM-Triage</strong> (Hosted in National Informatics Centre Cloud, New Delhi).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">National Gateway & Integration Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time health monitoring of interconnected government services.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ● All Systems Operational
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {INTEGRATION_STATUSES.map((item) => (
              <div key={item.service} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Server size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.service}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">{item.endpoint}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                    <span className="font-mono font-bold text-slate-800">{item.latency}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Uptime (30d)</span>
                    <span className="font-mono font-bold text-emerald-700">{item.uptime}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Users / RBAC */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Configured administrative tiers for CPGRAMS Executive Command.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Apex Executive (Level 1)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Full Access</span>
              </div>
              <p className="text-slate-600 text-[11px]">Cabinet Secretary, Union Ministers, DARPG Secretary.</p>
              <ul className="text-slate-500 text-[11px] space-y-1 list-disc list-inside pt-1">
                <li>Dispatch National Policy Directives</li>
                <li>Cross-Ministry Department Summons</li>
                <li>Real-Time SLA & Bottleneck Override</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Senior Nodal Officer (Level 2)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Ministry Scope</span>
              </div>
              <p className="text-slate-600 text-[11px]">Joint Secretaries, Chief Vigilance Officers.</p>
              <ul className="text-slate-500 text-[11px] space-y-1 list-disc list-inside pt-1">
                <li>Subordinate Case Re-Assignment</li>
                <li>Disposal Order Verification</li>
                <li>Department SLA Audits</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">District Magistrate (Level 3)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">District Scope</span>
              </div>
              <p className="text-slate-600 text-[11px]">District Collectors, Municipal Commissioners.</p>
              <ul className="text-slate-500 text-[11px] space-y-1 list-disc list-inside pt-1">
                <li>Local Field Investigation Dispatch</li>
                <li>Revenue Patwari Allocation</li>
                <li>District Hotspot Monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Immutable Security & Action Audit Trail</h3>
            <span className="text-xs text-slate-500 font-mono">Live Ledger</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Executed by <strong className="text-slate-700">{log.actor}</strong> ({log.role})
                  </p>
                </div>

                <div className="text-right font-mono text-[11px] text-slate-400">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
