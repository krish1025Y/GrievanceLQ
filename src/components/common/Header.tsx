import React, { useState } from 'react';
import {
  Search,
  Bell,
  Download,
  Shield,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Building,
  Menu
} from 'lucide-react';
import { GrievanceRecord, SLABreachAlert } from '../../types';

interface HeaderProps {
  onOpenExport: () => void;
  alerts: SLABreachAlert[];
  grievances: GrievanceRecord[];
  onSelectGrievance: (grv: GrievanceRecord) => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  alerts,
  grievances,
  onSelectGrievance,
  onToggleMobileSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    name: 'Dr. Rajiv Gauba, IAS',
    title: 'Cabinet Secretary / Apex Nodal Head',
    roleCode: 'APEX_EXECUTIVE',
    avatar: 'RG',
  });

  // Global search filtering
  const matchingGrievances = searchQuery.trim()
    ? grievances
        .filter(
          (g) =>
            g.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.district.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const roles = [
    { name: 'Dr. Rajiv Gauba, IAS', title: 'Cabinet Secretary / Apex Head', roleCode: 'APEX_EXECUTIVE', avatar: 'RG' },
    { name: 'Dr. Rajeshwar Sharma, IAS', title: 'Senior Nodal Officer (DARPG)', roleCode: 'NODAL_OFFICER', avatar: 'RS' },
    { name: 'Smt. Ananya Sengupta, IAS', title: 'Director (Public Grievances)', roleCode: 'DIR_PG', avatar: 'AS' },
    { name: 'Shri Vikramaditya Verma, CSS', title: 'Chief Quality Auditor', roleCode: 'AUDITOR', avatar: 'VV' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30">
      {/* Left: Hamburger (mobile) + Branding & Tagline */}
      <div className="flex items-center gap-3 shrink-0">
        {onToggleMobileSidebar && (
          <button
            type="button"
            id="header-mobile-menu-btn"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0b3c6d] rounded-lg flex items-center justify-center text-white shadow-xs shrink-0">
            <Shield size={17} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                CPGRAMS <span className="text-[#0b3c6d] font-semibold">Portal</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                Gov of India
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Centralized Public Grievance Redress and Monitoring System • DARPG
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search with Instant Flyout */}
      <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search CPGRAMS registration ID, citizen, department..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
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

        {/* Search Dropdown Results */}
        {isSearchOpen && searchQuery.trim() && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs divide-y divide-slate-100 max-h-80 overflow-y-auto">
              <div className="p-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Matching Case Records</span>
                <span>{matchingGrievances.length} results</span>
              </div>
              {matchingGrievances.length > 0 ? (
                matchingGrievances.map((grv) => (
                  <div
                    key={grv.id}
                    onClick={() => {
                      onSelectGrievance(grv);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-blue-700">{grv.registrationNumber}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {grv.status}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900 truncate">{grv.subject}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{grv.citizenName}</span>
                      <span>•</span>
                      <span>{grv.district}, {grv.state}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-medium truncate">{grv.department}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No matching grievances found for "{searchQuery}".
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Action buttons, Alerts bell, Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
        {/* Export Report Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center px-3.5 py-1.5 bg-[#0b3c6d] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#082a4d] transition-colors gap-1.5 cursor-pointer"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Export Report</span>
        </button>

        {/* Notification Bell with Live Alerts */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#0b3c6d] text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-xs">
                {alerts.length}
              </span>
            )}
          </button>

          {/* Notification Flyout */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={15} className="text-slate-300" />
                    <span className="text-xs font-bold text-slate-100">SLA Incident & Escalation Feed</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-2 py-0.5 rounded">
                    {alerts.length} Pending
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => {
                        const match = grievances.find((g) => g.id === alert.grievanceId);
                        if (match) onSelectGrievance(match);
                        setIsNotificationsOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-slate-800">{alert.registrationNumber}</span>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                          {alert.timeDisplay}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium text-[11px] leading-snug">{alert.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                        <span>{alert.district}, {alert.state}</span>
                        <span className="text-slate-400 font-mono">{alert.assignedOfficer}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 text-center">
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-xs text-slate-700 hover:text-slate-900 font-semibold hover:underline cursor-pointer"
                  >
                    View SLA Command Center →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
          >
            <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center">
              {currentRole.avatar}
            </div>
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-xs divide-y divide-slate-100">
                <div className="p-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Current Role Profile</p>
                  <p className="font-bold text-slate-900 mt-0.5">{currentRole.name}</p>
                  <p className="text-[11px] text-slate-500">{currentRole.title}</p>
                </div>
                <div className="py-2 space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 px-2">Switch Executive Persona</p>
                  {roles.map((r) => (
                    <button
                      key={r.roleCode}
                      onClick={() => {
                        setCurrentRole(r);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentRole.roleCode === r.roleCode ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{r.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{r.title}</p>
                      </div>
                      {currentRole.roleCode === r.roleCode && <CheckCircle size={14} className="text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <div className="p-2 text-[11px] text-slate-400">
                    Access Level: <strong>Full Apex Executive (Level 1)</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
