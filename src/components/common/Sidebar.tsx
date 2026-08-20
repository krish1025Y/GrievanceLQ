import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  TrendingUp,
  MessageSquare,
  Shield,
  ChevronLeft,
  ChevronRight,
  Bot
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../../utils/translations';

export type NavTabId =
  | 'overview'
  | 'maps'
  | 'grievances'
  | 'insights'
  | 'whatsapp_bot'
  | 'district'
  | 'predictive'
  | 'sla'
  | 'department'
  | 'sentiment'
  | 'bottleneck'
  | 'recommendations'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  slaBreachCount: number;
  criticalCasesCount: number;
  recommendationsCount: number;
  language: AppLanguage;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  slaBreachCount,
  criticalCasesCount,
  recommendationsCount,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    {
      id: 'overview' as NavTabId,
      label: t.tabDashboard,
      subtitle: t.tabDashboardSub,
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: 'maps' as NavTabId,
      label: t.tabMaps,
      subtitle: t.tabMapsSub,
      icon: <MapPin size={19} />,
    },
    {
      id: 'grievances' as NavTabId,
      label: t.tabGrievances,
      subtitle: t.tabGrievancesSub,
      icon: <FileText size={19} />,
      badge: criticalCasesCount > 0 ? `${criticalCasesCount}` : undefined,
    },
    {
      id: 'insights' as NavTabId,
      label: t.tabPredictive,
      subtitle: t.tabPredictiveSub,
      icon: <TrendingUp size={19} />,
    },
    {
      id: 'whatsapp_bot' as NavTabId,
      label: t.tabWhatsAppBot,
      subtitle: t.tabWhatsAppBotSub,
      icon: <Bot size={19} />,
      isNew: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      <aside
        id="app-sidebar"
        className={`bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 transition-all duration-300 z-40 lg:z-20 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl flex'
            : 'hidden lg:flex'
        } ${isCollapsed && !isMobileOpen ? 'lg:w-20' : 'lg:w-72'}`}
      >
        <div className="flex-1 p-4 space-y-5 overflow-y-auto">
          {/* App Brand / Identity Badge */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
              <Shield size={20} className="text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-slate-900 leading-none truncate">
                  {t.appTitle}
                </h2>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {t.appSubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Quick Location / Jurisdictional Pill */}
          {(!isCollapsed || isMobileOpen) && (
            <div className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-mono border border-slate-200/70 transition-colors">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span className="truncate text-[11px] text-slate-600 font-medium">
                28.6139° N, 77.2090° E (New Delhi)
              </span>
            </div>
          )}

          {/* Navigation Menu Links */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left select-none ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                  title={isCollapsed && !isMobileOpen ? item.label : undefined}
                >
                  <div className="shrink-0">{item.icon}</div>
                  {(!isCollapsed || isMobileOpen) && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs tracking-tight truncate font-semibold">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.isNew && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                              isActive
                                ? 'bg-emerald-500 text-white'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            AI Bot
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & collapse toggle */}
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 animate-pulse"></div>
              <span className="text-[11px] font-medium text-slate-500">DARPG National Node</span>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-auto cursor-pointer"
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>
    </>
  );
};
