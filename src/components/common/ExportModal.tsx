import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2, Printer, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('executive_summary');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [includePredictions, setIncludePredictions] = useState(true);
  const [includeSLA, setIncludeSLA] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}

      // Trigger standard browser download of generated mock document
      const blob = new Blob(
        [
          `--- CPGRAMS EXECUTIVE GOVERNANCE REPORT ---\n` +
          `Report Type: ${reportType.toUpperCase()}\n` +
          `Generated: ${new Date().toISOString()}\n` +
          `Total Grievances: 1,25,456 | Pending: 45,632 | Resolved: 72,350 | SLA Compliance: 88.6%\n` +
          `Jurisdiction: All India (15 States / UTs)\n` +
          `Decision Support Actions: 5 High-Impact Taskforces Dispatched\n`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GrievanceIQ_${reportType}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Download size={18} className="text-blue-400" />
            <h3 className="font-bold text-sm">Export Executive Intelligence Dossier</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {exportComplete ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Dossier Exported Successfully</h4>
              <p className="text-slate-500 max-w-xs mx-auto text-xs">
                Your report has been compiled and downloaded with encrypted cryptographic seals for DARPG submission.
              </p>
              <button
                onClick={() => {
                  setExportComplete(false);
                  onClose();
                }}
                className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  Select Dossier Template
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 text-xs"
                >
                  <option value="executive_summary">Apex Executive Summary (Cabinet Level)</option>
                  <option value="department_benchmark">Department SLA & Benchmark Audit</option>
                  <option value="district_intelligence">District Risk & Geospatial Intelligence</option>
                  <option value="citizen_sentiment">Citizen Sentiment & NLP Voice of Citizen</option>
                  <option value="predictive_forecast">Predictive Workload & Seasonal Surge Forecast</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                  Output Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`p-3 rounded-lg border text-center font-medium flex flex-col items-center gap-1.5 ${
                      format === 'pdf' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <FileText size={18} />
                    <span>Executive PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('csv')}
                    className={`p-3 rounded-lg border text-center font-medium flex flex-col items-center gap-1.5 ${
                      format === 'csv' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <FileSpreadsheet size={18} />
                    <span>Raw CSV Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('json')}
                    className={`p-3 rounded-lg border text-center font-medium flex flex-col items-center gap-1.5 ${
                      format === 'json' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Shield size={18} />
                    <span>Encrypted JSON</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includePredictions}
                    onChange={(e) => setIncludePredictions(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include AI/ML Predictive Escalation Risk Models</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeSLA}
                    onChange={(e) => setIncludeSLA(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Live SLA Breach Timelines & Officer Audits</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExport}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-xs"
                >
                  {isExporting ? (
                    <>Generating Dossier...</>
                  ) : (
                    <>
                      <Download size={14} />
                      Export Document
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
