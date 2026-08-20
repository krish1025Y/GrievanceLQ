import React, { useState } from 'react';
import {
  Search,
  Bell,
  Download,
  Menu,
  Globe,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check
} from 'lucide-react';
import { SLABreachAlert, GrievanceRecord } from '../../types';
import { AppLanguage, TRANSLATIONS } from '../../utils/translations';

interface HeaderProps {
  onOpenExport: () => void;
  alerts: SLABreachAlert[];
  grievances: GrievanceRecord[];
  onSelectGrievance: (grv: GrievanceRecord) => void;
  onToggleMobileSidebar: () => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  alerts,
  grievances,
  onSelectGrievance,
  onToggleMobileSidebar,
  language,
  onLanguageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [readAlertIds, setReadAlertIds] = useState<string[]>([]);

  const t = TRANSLATIONS[language];

  const searchResults = grievances
    .filter((g) => {
      if (!searchQuery.trim()) return false;
      const q = searchQuery.toLowerCase();
      return (
        g.registrationNumber.toLowerCase().includes(q) ||
        g.citizenName.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q)
      );
    })
    .slice(0, 5);

  const unreadAlertsCount = alerts.filter((a) => !readAlertIds.includes(a.id)).length;

  const markAllAlertsRead = () => {
    setReadAlertIds(alerts.map((a) => a.id));
  };

  const languagesList: { id: AppLanguage; label: string; native: string }[] = [
    { id: 'en', label: 'English', native: 'English' },
    { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { id: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              {t.welcomeExecutive}
            </h1>
            <span className="text-[11px] text-slate-500 font-medium">
              {t.portalSubtitle}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden divide-y divide-slate-100 text-xs animate-in fade-in duration-150">
              <div className="p-2.5 bg-slate-50 text-slate-500 font-semibold text-[11px]">
                Search Matches ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((grv) => (
                  <div
                    key={grv.id}
                    onClick={() => {
                      onSelectGrievance(grv);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono font-bold text-slate-900">{grv.registrationNumber}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {grv.status}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 truncate">{grv.subject}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{grv.citizenName} • {grv.district}, {grv.state}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">{t.noRecordsFound}</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Actions: Language Selector, Notifications, Export */}
      <div className="flex items-center gap-2.5">
        {/* Language Multi-Toggle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            aria-label="Change Language"
          >
            <Globe size={14} className="text-slate-500" />
            <span className="font-medium">
              {languagesList.find((l) => l.id === language)?.native}
            </span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {isLangMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden py-1 divide-y divide-slate-100 text-xs animate-in fade-in duration-150">
                {languagesList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onLanguageChange(item.id);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      language === item.id ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    <span>{item.native} ({item.label})</span>
                    {language === item.id && <Check size={14} className="text-slate-900" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications Popover with Smooth Styling */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer border border-transparent hover:border-slate-200/60"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-xs animate-in fade-in duration-150">
                {/* Popover Header */}
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-400" />
                    <span className="font-bold text-xs">{t.incidentAlerts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllAlertsRead}
                      className="text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Mark read
                    </button>
                    <span className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full font-mono">
                      {unreadAlertsCount} New
                    </span>
                  </div>
                </div>

                {/* Alerts List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {alerts.map((alert) => {
                    const isRead = readAlertIds.includes(alert.id);
                    return (
                      <div
                        key={alert.id}
                        className={`p-3.5 transition-colors cursor-pointer ${
                          isRead ? 'bg-white hover:bg-slate-50 opacity-75' : 'bg-slate-50/70 hover:bg-slate-100/80 font-medium'
                        }`}
                        onClick={() => {
                          setReadAlertIds((prev) => [...prev, alert.id]);
                          const match = grievances.find((g) => g.id === alert.grievanceId);
                          if (match) onSelectGrievance(match);
                          setIsNotificationsOpen(false);
                        }}
                      >
                        <div className="flex justify-between font-mono text-[11px] mb-1 text-slate-800">
                          <span className="font-bold text-slate-900">{alert.registrationNumber}</span>
                          <span className="text-slate-400 font-normal flex items-center gap-1">
                            <Clock size={11} /> {alert.timeDisplay}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-500 font-medium">
                    National Escalation Desk • Nodal Response Synchronized
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export Briefing Button */}
        <button
          onClick={onOpenExport}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          <Download size={13} />
          <span>{t.exportReport}</span>
        </button>
      </div>
    </header>
  );
};
