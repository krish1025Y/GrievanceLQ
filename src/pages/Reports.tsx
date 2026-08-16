import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  Share2,
  Calendar,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  Eye
} from 'lucide-react';
import { GENERATED_REPORTS } from '../data/mockData';
import { GeneratedReportItem } from '../types';
import { KPICard } from '../components/common/KPICard';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<GeneratedReportItem[]>(GENERATED_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('weekly_executive');
  const [customRange, setCustomRange] = useState('Last 30 Days');
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');
  const [previewReport, setPreviewReport] = useState<GeneratedReportItem | null>(null);

  const reportTemplates = [
    {
      id: 'weekly_executive',
      name: 'Weekly Apex Executive Briefing',
      desc: 'High-level synthesis of national grievance velocity, critical escalations, and SLA health for Cabinet Secretariat.',
      badge: 'Cabinet Level',
      frequency: 'Every Monday 08:00 IST',
    },
    {
      id: 'monthly_sla',
      name: 'Monthly Department SLA & Compliance Audit',
      desc: 'Exhaustive cross-ministry performance ranking, premature closure rates, and statutory violation penalties.',
      badge: 'Audit & Compliance',
      frequency: '1st of Month',
    },
    {
      id: 'district_risk',
      name: 'District Risk & Hotspot Assessment Dossier',
      desc: 'Geospatial breakdown of high-backlog districts, local nodal officer allocations, and forecast surges.',
      badge: 'Geospatial Intel',
      frequency: 'Bi-Weekly',
    },
    {
      id: 'citizen_sentiment',
      name: 'Citizen Sentiment & Voice of Citizen Deep-Dive',
      desc: 'Multilingual NLP sentiment trajectories, emotion scoring, and recurring citizen pain-point clusters.',
      badge: 'Public Voice',
      frequency: 'Monthly',
    },
  ];

  const handleGenerateCustom = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newReport: GeneratedReportItem = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        name: `Custom Dossier — ${selectedTemplate.replace(/_/g, ' ').toUpperCase()}`,
        type: 'Executive Dossier',
        generatedDate: new Date().toISOString().slice(0, 10),
        format: selectedFormat,
        fileSize: selectedFormat === 'PDF' ? '3.8 MB' : selectedFormat === 'CSV' ? '920 KB' : '410 KB',
        author: 'Dr. Rajiv Gauba, IAS',
      };
      setReports([newReport, ...reports]);
    }, 1200);
  };

  const handleDownload = (rep: GeneratedReportItem) => {
    const text = `--- CPGRAMS OFFICIAL AUDIT REPORT ---\n` +
      `Report: ${rep.name}\n` +
      `Type: ${rep.type}\n` +
      `Date Generated: ${rep.generatedDate}\n` +
      `Author: ${rep.author}\n` +
      `National Total Grievances: 1,25,456\n` +
      `Disposed Cases: 72,350\n` +
      `SLA Compliance: 88.6%\n` +
      `Cryptographic Hash: SHA256-GOV-IND-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.name.replace(/\s+/g, '_')}.${rep.format.toLowerCase() === 'pdf' ? 'txt' : rep.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider flex items-center gap-1">
              <FileSpreadsheet size={13} className="text-blue-600" />
              Statutory Governance Reporting
            </span>
            <span className="text-xs text-slate-400 font-mono">Encrypted DARPG Archives</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Executive Intelligence Reports & Audit Archives
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated compilation of cabinet briefing dossiers, cross-department audits, and public grievance statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono">
            Archived Reports: <strong className="text-blue-400">{reports.length} Dossiers</strong>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Generated This Month"
          value="28 Dossiers"
          subValue="Auto-Scheduled & Ad-Hoc"
          icon={<FileText size={18} />}
          accentColor="blue"
          tooltipText="Total formal audit dossiers created in current monthly cycle."
        />
        <KPICard
          title="Subscribed Apex Recipients"
          value="142 Officers"
          subValue="Ministers, DMs, & Secretaries"
          icon={<Share2 size={18} />}
          accentColor="emerald"
          tooltipText="Executive stakeholders receiving automated encrypted PDF briefings."
        />
        <KPICard
          title="Next Scheduled Batch"
          value="Monday 08:00"
          subValue="Weekly Apex Digest"
          icon={<Clock size={18} />}
          accentColor="amber"
          tooltipText="Next scheduled cron compilation for national grievance indicators."
        />
        <KPICard
          title="Data Integrity Audit"
          value="100% Sealed"
          subValue="SHA-256 Checksums Verified"
          icon={<CheckCircle size={18} />}
          accentColor="purple"
          tooltipText="Cryptographic verification certifying zero data alteration."
        />
      </div>

      {/* Pre-Built Template Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Standard Pre-Configured Dossier Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedTemplate === tpl.id
                  ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {tpl.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{tpl.frequency}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{tpl.name}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{tpl.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>Select Template</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Report Builder Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Generate On-Demand Executive Dossier</h3>
          </div>
          <span className="text-xs text-slate-400">Custom Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1.5">Time Horizon</label>
            <select
              value={customRange}
              onChange={(e) => setCustomRange(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="Last 7 Days">Last 7 Days (Tactical)</option>
              <option value="Last 30 Days">Last 30 Days (Standard Month)</option>
              <option value="Q1 FY 2026">Q1 FY 2026 (Quarterly Review)</option>
              <option value="Full FY 2025-26">Full FY 2025-26 (Annual Audit)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase text-[11px] mb-1.5">Output Format</label>
            <div className="flex gap-2">
              {(['PDF', 'CSV', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs border transition-colors ${
                    selectedFormat === fmt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span>Compiling Dossier...</span>
              ) : (
                <>
                  <Plus size={14} />
                  Compile & Seal Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Generated Reports Archive</h3>
          <span className="text-xs text-slate-500">{reports.length} Reports in Vault</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-3 px-4">Report Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Author / Signature</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={15} className="text-blue-600 shrink-0" />
                    <span>{rep.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{rep.type}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{rep.generatedDate}</td>
                  <td className="py-3 px-4 text-slate-700">{rep.author}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-800">
                      {rep.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{rep.fileSize}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewReport(rep)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                        title="View Executive Summary"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(rep)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                        title="Download Document"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  Document Preview
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{previewReport.name}</h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">
                ×
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-800">
              <p>GOVERNMENT OF INDIA • DARPG EXECUTIVE COMMAND</p>
              <p>Subject: {previewReport.name}</p>
              <p>Signatory: {previewReport.author}</p>
              <p>Timestamp: {previewReport.generatedDate} | Format: {previewReport.format}</p>
              <hr className="border-slate-200 my-2" />
              <p>• Total Grievances Processed: 1,25,456</p>
              <p>• Cases Resolved on Time: 72,350 (88.6% SLA Compliance)</p>
              <p>• Active Systemic Bottlenecks: 5 Choke Nodes</p>
              <p>• High-Risk Clusters: 6 State Hubs</p>
              <p className="text-emerald-700 font-bold">• Cryptographic Verification: VALID</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownload(previewReport);
                  setPreviewReport(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Download size={13} />
                Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
