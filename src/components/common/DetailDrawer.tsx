import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Building2,
  MapPin,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  TrendingUp,
  MessageSquare,
  Shield,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { GrievanceRecord } from '../../types';
import { StatusBadge } from './StatusBadge';

interface DetailDrawerProps {
  grievance: GrievanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: GrievanceRecord['status']) => void;
  onAssignAction?: (id: string, actionNote: string) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  grievance,
  isOpen,
  onClose,
  onStatusChange,
  onAssignAction,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'nlp' | 'actions'>('overview');
  const [actionNote, setActionNote] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!isOpen || !grievance) return null;

  const handleTakeAction = (type: string) => {
    if (type === 'resolve') {
      onStatusChange?.(grievance.id, 'Resolved');
      setActionFeedback('Grievance marked as Resolved with closure report generated.');
    } else if (type === 'escalate') {
      onStatusChange?.(grievance.id, 'Investigation');
      setActionFeedback('Case escalated to Secretary / Senior Nodal Committee.');
    } else if (type === 'reopen') {
      onStatusChange?.(grievance.id, 'Under Review');
      setActionFeedback('Premature closure flagged and ticket reopened for re-investigation.');
    }
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleCustomActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionNote.trim()) return;
    onAssignAction?.(grievance.id, actionNote);
    setActionFeedback(`Official Directive Logged: "${actionNote}"`);
    setActionNote('');
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-lg text-blue-300">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {grievance.registrationNumber}
                </span>
                <StatusBadge type="priority" value={grievance.priority} />
                <StatusBadge type="sla" value={grievance.slaStatus} />
              </div>
              <p className="text-xs text-slate-300 truncate max-w-md mt-0.5">
                {grievance.subject}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Case Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Timeline ({grievance.timeline.length})
          </button>
          <button
            onClick={() => setActiveTab('nlp')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'nlp'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={13} className="text-purple-600" />
            AI & NLP Insights
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-700 bg-white shadow-2xs -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct Action
          </button>
        </div>

        {/* Feedback banner */}
        {actionFeedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle size={14} className="text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CASE OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Status</span>
                  <div className="mt-1">
                    <StatusBadge type="status" value={grievance.status} size="md" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">SLA Window</span>
                  <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-900 font-mono">
                    <Clock size={13} className="text-amber-600" />
                    {grievance.slaRemainingMinutes > 0
                      ? `${Math.floor(grievance.slaRemainingMinutes / 60)}h ${grievance.slaRemainingMinutes % 60}m remaining`
                      : 'BREACHED'}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Predicted Risk</span>
                  <div className="mt-1">
                    <StatusBadge type="risk" value={grievance.predictedRisk} size="md" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block uppercase">Citizen Sentiment</span>
                  <div className="mt-1">
                    <StatusBadge type="sentiment" value={grievance.sentiment} size="md" />
                  </div>
                </div>
              </div>

              {/* Grievance Statement */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Grievance Statement
                </h4>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  {grievance.subject}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100 font-sans">
                  {grievance.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Category: {grievance.category}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Registered: {grievance.createdDate}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Last Active: {grievance.lastUpdated}</span>
                </div>
              </div>

              {/* Citizen Details & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Citizen */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <User size={14} className="text-blue-600" />
                    Complainant Details
                  </h4>
                  <p className="text-xs font-bold text-slate-900">{grievance.citizenName}</p>
                  <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" />
                      <span>{grievance.citizenPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" />
                      <span className="truncate">{grievance.citizenEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Location & Jurisdiction */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" />
                    Administrative Jurisdiction
                  </h4>
                  <p className="text-xs font-bold text-slate-900">{grievance.district}, {grievance.state}</p>
                  <p className="text-xs text-slate-600 mt-1">{grievance.department}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{grievance.subDepartment}</p>
                </div>
              </div>

              {/* Assigned Officer */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield size={14} className="text-indigo-600" />
                    Assigned Nodal Officer
                  </span>
                  <span className="text-[11px] text-blue-600 font-normal">Active Custodian</span>
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                    {grievance.assignedOfficer.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">{grievance.assignedOfficer.name}</p>
                    <p className="text-[11px] text-slate-600">{grievance.assignedOfficer.designation}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>{grievance.assignedOfficer.phone}</span>
                      <span>•</span>
                      <span>{grievance.assignedOfficer.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Citizen Feedback if resolved */}
              {grievance.citizenFeedback && (
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-emerald-700" />
                    Citizen Post-Resolution Feedback
                  </h4>
                  <div className="flex items-center gap-1 text-amber-500 mb-1.5 text-xs">
                    {'★'.repeat(grievance.citizenFeedback.rating)}
                    {'☆'.repeat(5 - grievance.citizenFeedback.rating)}
                    <span className="text-slate-600 ml-1 font-medium text-[11px]">({grievance.citizenFeedback.rating}/5)</span>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "{grievance.citizenFeedback.comment}"
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 2: AUDIT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Immutable CPGRAMS Lifecycle Trail
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Blockchain Hash Verified</span>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 my-4">
                {grievance.timeline.map((event, idx) => (
                  <div key={event.id} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 group-hover:scale-110 transition-transform" />
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{event.stage}</span>
                        <span className="text-[11px] font-mono text-slate-500">{event.timestamp}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600">
                        Actor: <span className="text-slate-900">{event.actor}</span> ({event.role})
                      </p>
                      <p className="text-xs text-slate-700 mt-1.5">{event.description}</p>
                      {event.actionTaken && (
                        <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-200 font-medium">
                          Action: {event.actionTaken}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI & NLP INSIGHTS */}
          {activeTab === 'nlp' && (
            <div className="space-y-4">
              {/* Risk Prediction Box */}
              <div className="border border-purple-200 bg-purple-50/50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-purple-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-purple-600" />
                    Predictive Escalation Risk Model
                  </span>
                  <span className="text-xs font-bold font-mono text-purple-800">
                    Score: {grievance.predictedRiskScore}/100
                  </span>
                </div>
                <p className="text-xs text-purple-900">
                  {grievance.predictedRisk === 'Critical'
                    ? 'CRITICAL PROBABILITY OF LEGAL / MEDIA ESCALATION: Case involves repeated systemic delays and high citizen dissatisfaction markers.'
                    : grievance.predictedRisk === 'High'
                    ? 'ELEVATED RISK: Expected to breach SLA within 24 hours if not reassigned or expedited immediately.'
                    : 'Standard governance risk profile. Routine handling recommended.'}
                </p>
              </div>

              {/* Premature Closure Flag */}
              <div className={`p-4 rounded-xl border ${grievance.prematureClosureRisk ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle size={14} className={grievance.prematureClosureRisk ? 'text-rose-600' : 'text-slate-400'} />
                    Premature Ticket Closure Audit
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${grievance.prematureClosureRisk ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {grievance.prematureClosureRisk ? 'RISK DETECTED' : 'CLEAR'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {grievance.prematureClosureRisk
                    ? 'NLP model detected boilerplate dismissal phrasing in previous ticket lifecycle without accompanying payment/sanction verification.'
                    : 'Disposal evidence conforms with standard DARPG Quality Guidelines.'}
                </p>
              </div>

              {/* Sentiment & Keywords */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  NLP Extracted Pain Points & Polarity
                </h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${grievance.sentimentScore > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.abs(grievance.sentimentScore) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    Polarity: {grievance.sentimentScore > 0 ? `+${grievance.sentimentScore}` : grievance.sentimentScore}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {grievance.sentimentKeywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="border border-blue-200 bg-blue-50/60 p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-blue-700" />
                  Decision Support: Recommended Action
                </h4>
                <p className="text-xs text-blue-950 font-medium leading-relaxed">
                  {grievance.recommendedAction}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DIRECT ACTION */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Executive Fast-Track Triggers
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Take instantaneous administrative action authorized under CPGRAMS Executive Oversight.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTakeAction('resolve')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <CheckCircle size={14} />
                    Approve Disposal
                  </button>
                  <button
                    onClick={() => handleTakeAction('escalate')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <AlertTriangle size={14} />
                    Escalate to DM / Secy
                  </button>
                  <button
                    onClick={() => handleTakeAction('reopen')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <RotateCcw size={14} />
                    Mandate Re-Open
                  </button>
                </div>
              </div>

              {/* Direct Note Form */}
              <form onSubmit={handleCustomActionSubmit} className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Issue Direct Nodal Order / File Note
                </h4>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Type official instruction or investigation directive for the assigned nodal team..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-semibold transition-colors"
                  >
                    <Send size={13} />
                    Dispatch Directive
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Case ID: {grievance.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
