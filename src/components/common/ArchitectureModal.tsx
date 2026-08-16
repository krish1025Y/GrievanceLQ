import React from 'react';
import { X, Database, Cpu, Brain, Layers, Server, Activity, ShieldAlert, BarChart3, Users, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold px-2 py-0.5 rounded">
                REFERENCE ARCHITECTURE
              </span>
              <span className="text-xs text-slate-400">PS-05 Technical Specification</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CPGRAMS Executive Command Center — End-to-End Pipeline
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              From CPGRAMS Historical & Live Streams → Analytics & NLP → Decision Support → Executive Action
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pipeline Diagram Flow */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Top 5 Pipeline Sequence */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* 1. Data Source */}
            <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded">1. Data Source</span>
                <Database size={16} className="text-blue-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">CPGRAMS Ingestion</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• Historical Grievance Logs</li>
                <li>• API & Portal Stream</li>
                <li>• Citizen Feedback Metadata</li>
                <li>• Ministry Registry</li>
              </ul>
            </div>

            {/* 2. Preprocessing */}
            <div className="bg-slate-50 border border-teal-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-teal-700 bg-teal-100 px-2 py-0.5 rounded">2. Ingestion & Clean</span>
                <Cpu size={16} className="text-teal-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">Data Pipeline</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• Missing Value Imputation</li>
                <li>• NLP Tokenization</li>
                <li>• Feature Engineering</li>
                <li>• Duplicate Ticket Filter</li>
              </ul>
            </div>

            {/* 3. Database */}
            <div className="bg-slate-50 border border-emerald-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">3. Storage Layer</span>
                <Server size={16} className="text-emerald-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">RDBMS / Relational</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• Grievance Records</li>
                <li>• Depts & Ministries</li>
                <li>• State/District Hierarchies</li>
                <li>• SLA Timelines & Audits</li>
              </ul>
            </div>

            {/* 4. API & Backend */}
            <div className="bg-slate-50 border border-amber-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">4. Backend API</span>
                <Layers size={16} className="text-amber-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">FastAPI & Gateway</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• REST & Real-time Feeds</li>
                <li>• RBAC Authorization</li>
                <li>• ML Model Inference</li>
                <li>• Export Generation</li>
              </ul>
            </div>

            {/* 5. Analytics Engine */}
            <div className="bg-slate-50 border border-purple-200 rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">5. Analytics Core</span>
                <BarChart3 size={16} className="text-purple-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5">Statistical Engine</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• SLA Drift & Breaches</li>
                <li>• Dept Benchmarking</li>
                <li>• District Risk Index</li>
                <li>• Category Trends</li>
              </ul>
            </div>
          </div>

          {/* AI / ML Layer + Decision Support System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI / ML Layer */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                  <Brain size={14} /> 6. AI & Machine Learning Layer
                </span>
                <span className="text-[11px] text-rose-600 font-mono">scikit-learn + NLP</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div className="bg-white p-2.5 rounded-lg border border-rose-100 shadow-xs">
                  <p className="font-semibold text-slate-900">Machine Learning</p>
                  <p className="text-[11px] text-slate-600 mt-1">• Time-Series Grievance Forecasting</p>
                  <p className="text-[11px] text-slate-600">• Hotspot District Clustering</p>
                  <p className="text-[11px] text-slate-600">• Premature Closure Risk Model</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-rose-100 shadow-xs">
                  <p className="font-semibold text-slate-900">NLP & Sentiment</p>
                  <p className="text-[11px] text-slate-600">• Citizen Feedback Sentiment</p>
                  <p className="text-[11px] text-slate-600">• Pain Point Keyword Extraction</p>
                  <p className="text-[11px] text-slate-600">• Root-Cause Latency Categorizer</p>
                </div>
              </div>
            </div>

            {/* Decision Support System */}
            <div className="bg-amber-50/60 border border-amber-300 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                  <ShieldAlert size={14} /> 7. Decision Support System (DSS)
                </span>
                <span className="text-[11px] text-amber-800 font-medium">Predictive Governance</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                  <p className="font-bold text-slate-800 text-[11px]">SLA Breach Alerts</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Real-time countdowns</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                  <p className="font-bold text-slate-800 text-[11px]">Bottleneck Detector</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ranked root cause</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-amber-200 text-center">
                  <p className="font-bold text-slate-800 text-[11px]">Resource Allocation</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Automated taskforce</p>
                </div>
              </div>
            </div>
          </div>

          {/* End Users & Impact */}
          <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-blue-400">Target Stakeholders</p>
                <p className="text-sm font-bold text-white">Ministry Heads • Senior Nodal Officers • Policy Makers • Dept Administrators</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 font-mono text-emerald-400">
              <CheckCircle2 size={15} />
              <span>RAW DATA → INSIGHT → ACTION → IMPACT</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>GrievanceIQ Platform Architecture v2.4 • Integrated with CPGRAMS 7.0 API</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
