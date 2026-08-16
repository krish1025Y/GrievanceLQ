import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  Building,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { GrievanceRecord, PriorityLevel, CaseStatus, SLAStatus, RiskLevel } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface GrievanceManagementProps {
  grievances: GrievanceRecord[];
  onSelectGrievance: (grv: GrievanceRecord) => void;
  onBulkStatusChange?: (ids: string[], status: CaseStatus) => void;
}

export const GrievanceManagement: React.FC<GrievanceManagementProps> = ({
  grievances,
  onSelectGrievance,
  onBulkStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const [sortField, setSortField] = useState<keyof GrievanceRecord>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [visibleColumns, setVisibleColumns] = useState({
    registrationNumber: true,
    citizenName: true,
    category: true,
    jurisdiction: true,
    department: true,
    priority: true,
    status: true,
    slaStatus: true,
    assignedOfficer: true,
    createdDate: true,
    predictedRisk: true,
  });

  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);

  // Status Tab counts
  const statusCounts = useMemo(() => {
    return {
      all: grievances.length,
      underReview: grievances.filter((g) => g.status === 'Under Review').length,
      investigation: grievances.filter((g) => g.status === 'Investigation').length,
      actionTaken: grievances.filter((g) => g.status === 'Action Taken').length,
      resolved: grievances.filter((g) => g.status === 'Resolved').length,
      appealed: grievances.filter((g) => g.status === 'Appealed').length,
      criticalRisk: grievances.filter((g) => g.predictedRisk === 'Critical').length,
    };
  }, [grievances]);

  // Filtering & Sorting
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          g.registrationNumber.toLowerCase().includes(q) ||
          g.citizenName.toLowerCase().includes(q) ||
          g.subject.toLowerCase().includes(q) ||
          g.department.toLowerCase().includes(q) ||
          g.district.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Status
      if (selectedStatus === 'underReview' && g.status !== 'Under Review') return false;
      if (selectedStatus === 'investigation' && g.status !== 'Investigation') return false;
      if (selectedStatus === 'actionTaken' && g.status !== 'Action Taken') return false;
      if (selectedStatus === 'resolved' && g.status !== 'Resolved') return false;
      if (selectedStatus === 'appealed' && g.status !== 'Appealed') return false;
      if (selectedStatus === 'criticalRisk' && g.predictedRisk !== 'Critical') return false;

      // Priority
      if (selectedPriority !== 'all' && g.priority !== selectedPriority) return false;

      // Risk
      if (selectedRisk !== 'all' && g.predictedRisk !== selectedRisk) return false;

      // Dept
      if (selectedDept !== 'all' && g.department !== selectedDept) return false;

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'assignedOfficer') {
        aVal = a.assignedOfficer.name;
        bVal = b.assignedOfficer.name;
      }

      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    grievances,
    searchQuery,
    selectedStatus,
    selectedPriority,
    selectedRisk,
    selectedDept,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredGrievances.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGrievances.slice(start, start + pageSize);
  }, [filteredGrievances, currentPage, pageSize]);

  const handleSort = (field: keyof GrievanceRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedData.map((d) => d.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = (action: 'resolve' | 'escalate') => {
    if (selectedIds.length === 0) return;
    if (action === 'resolve') {
      onBulkStatusChange?.(selectedIds, 'Resolved');
    } else {
      onBulkStatusChange?.(selectedIds, 'Investigation');
    }
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['Reg Number', 'Citizen', 'Category', 'State', 'District', 'Department', 'Priority', 'Status', 'SLA', 'Officer', 'Created', 'Risk'],
        ...filteredGrievances.map((g) => [
          g.registrationNumber,
          `"${g.citizenName}"`,
          `"${g.category}"`,
          g.state,
          g.district,
          `"${g.department}"`,
          g.priority,
          g.status,
          g.slaStatus,
          `"${g.assignedOfficer.name}"`,
          g.createdDate,
          g.predictedRisk,
        ]),
      ]
        .map((e) => e.join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Grievance_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with CRM Stats */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            CPGRAMS Case Management & Triage Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational CRM interface for searching, auditing, reassigning, and disposing citizen grievances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download size={13} />
            Export CSV ({filteredGrievances.length})
          </button>

          <div className="relative">
            <button
              onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal size={13} />
              Columns
            </button>

            {isColumnPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsColumnPickerOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 space-y-2 text-xs">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100">
                    Customize Table Columns
                  </div>
                  {Object.entries(visibleColumns).map(([key, isVis]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-slate-700 capitalize">
                      <input
                        type="checkbox"
                        checked={isVis}
                        onChange={(e) =>
                          setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })
                        }
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CRM Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-2">
        <button
          onClick={() => { setSelectedStatus('all'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Cases ({statusCounts.all})
        </button>
        <button
          onClick={() => { setSelectedStatus('underReview'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'underReview' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Under Review ({statusCounts.underReview})
        </button>
        <button
          onClick={() => { setSelectedStatus('investigation'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'investigation' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Investigation ({statusCounts.investigation})
        </button>
        <button
          onClick={() => { setSelectedStatus('actionTaken'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'actionTaken' ? 'bg-teal-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Action Taken ({statusCounts.actionTaken})
        </button>
        <button
          onClick={() => { setSelectedStatus('resolved'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'resolved' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Resolved ({statusCounts.resolved})
        </button>
        <button
          onClick={() => { setSelectedStatus('appealed'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedStatus === 'appealed' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Appealed ({statusCounts.appealed})
        </button>
        <button
          onClick={() => { setSelectedStatus('criticalRisk'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            selectedStatus === 'criticalRisk' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <AlertTriangle size={12} />
          High-Risk Escalations ({statusCounts.criticalRisk})
        </button>
      </div>

      {/* Quick Search & Filter Controls */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by ID, citizen name, subject, or district..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedPriority}
            onChange={(e) => { setSelectedPriority(e.target.value); setCurrentPage(1); }}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">All AI Risks</option>
            <option value="Critical">Critical Risk</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} className="text-blue-400" />
            <span className="font-bold">{selectedIds.length} Grievance Cases Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('resolve')}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
            >
              Batch Approve Disposal
            </button>
            <button
              onClick={() => handleBulkAction('escalate')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
            >
              Batch Escalate to DM
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main CRM Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((d) => selectedIds.includes(d.id))
                    }
                    onChange={handleSelectAllOnPage}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>

                {visibleColumns.registrationNumber && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('registrationNumber')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Registration ID</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.citizenName && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('citizenName')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Citizen</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.category && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Category</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.jurisdiction && (
                  <th className="py-3 px-3">State & District</th>
                )}

                {visibleColumns.department && (
                  <th className="py-3 px-3">Department</th>
                )}

                {visibleColumns.priority && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Priority</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.status && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.slaStatus && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('slaStatus')}
                  >
                    <div className="flex items-center gap-1">
                      <span>SLA Status</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.assignedOfficer && (
                  <th className="py-3 px-3">Assigned Nodal Officer</th>
                )}

                {visibleColumns.createdDate && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('createdDate')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Created</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                {visibleColumns.predictedRisk && (
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-800"
                    onClick={() => handleSort('predictedRisk')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Predicted Risk</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                )}

                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((grv) => {
                  const isSelected = selectedIds.includes(grv.id);
                  return (
                    <tr
                      key={grv.id}
                      onClick={() => onSelectGrievance(grv)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(grv.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {visibleColumns.registrationNumber && (
                        <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                          {grv.registrationNumber}
                        </td>
                      )}

                      {visibleColumns.citizenName && (
                        <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                          {grv.citizenName}
                        </td>
                      )}

                      {visibleColumns.category && (
                        <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                          {grv.category}
                        </td>
                      )}

                      {visibleColumns.jurisdiction && (
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {grv.district}, <span className="text-slate-400">{grv.state}</span>
                        </td>
                      )}

                      {visibleColumns.department && (
                        <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                          {grv.department}
                        </td>
                      )}

                      {visibleColumns.priority && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge type="priority" value={grv.priority} />
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge type="status" value={grv.status} />
                        </td>
                      )}

                      {visibleColumns.slaStatus && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge type="sla" value={grv.slaStatus} />
                        </td>
                      )}

                      {visibleColumns.assignedOfficer && (
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          <span className="font-medium text-slate-800">{grv.assignedOfficer.name.split(',')[0]}</span>
                        </td>
                      )}

                      {visibleColumns.createdDate && (
                        <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {grv.createdDate}
                        </td>
                      )}

                      {visibleColumns.predictedRisk && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <StatusBadge type="risk" value={grv.predictedRisk} />
                        </td>
                      )}

                      <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectGrievance(grv)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                          title="Open Case File"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-400">
                    No matching grievances found for the current query/filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-slate-300 rounded p-1 text-xs"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-400 ml-2">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredGrievances.length)} of {filteredGrievances.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-white border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
