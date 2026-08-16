import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Clock,
  MapPin,
  Building2,
  SmilePlus,
  TrendingUp,
  AlertOctagon,
  Lightbulb,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export type NavTabId =
  | 'overview'
  | 'maps'
  | 'grievances'
  | 'insights'
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
}) => {
  const navItems = [
    {
      id: 'overview' as NavTabId,
      label: 'Executive Overview',
      icon: <LayoutDashboard size={18} />,
      group: 'Core',
    },
    {
      id: 'maps' as NavTabId,
      label: 'Geospatial Maps',
      icon: <MapPin size={18} />,
      badge: 'Interactive',
      badgeColor: 'bg-blue-900/60 text-blue-300 font-bold border border-blue-700/50',
      group: 'Geospatial',
    },
    {
      id: 'grievances' as NavTabId,
      label: 'Grievance Directory',
      icon: <FileText size={18} />,
      badge: criticalCasesCount > 0 ? `${criticalCasesCount} alert` : undefined,
      badgeColor: 'bg-rose-900/60 text-rose-300 font-bold border border-rose-700/50',
      group: 'Caseload',
    },
    {
      id: 'insights' as NavTabId,
      label: 'AI & Predictive Insights',
      icon: <TrendingUp size={18} />,
      badge: 'ML Forecast',
      badgeColor: 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700/50',
      group: 'Intelligence',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      <aside
        id="app-sidebar"
        className={`bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 transition-all duration-300 z-40 lg:z-20 ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl flex'
            : 'hidden lg:flex'
        } ${isCollapsed && !isMobileOpen ? 'lg:w-16' : 'lg:w-64'}`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {/* Collapse toggle button on top right of sidebar */}
          <div className="px-3 py-2 mb-1 flex items-center justify-between">
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Navigation Modules
              </span>
            )}
            {/* Desktop Collapse Button */}
            <button
              type="button"
              id="sidebar-toggle-collapse-btn"
              onClick={onToggleCollapse}
              className="hidden lg:block p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button
                type="button"
                id="sidebar-mobile-close-btn"
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto cursor-pointer"
                title="Close Navigation Menu"
                aria-label="Close Navigation Menu"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Links */}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                id={`nav-tab-${item.id}`}
                data-tab-id={item.id}
                aria-selected={isActive}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer text-left select-none ${
                  isActive
                    ? 'bg-blue-600/20 text-white font-semibold border border-blue-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
              >
                <div
                  className={`shrink-0 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                  }`}
                >
                  {item.icon}
                </div>

                {(!isCollapsed || isMobileOpen) && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ml-1 font-mono tracking-tight shrink-0 ${
                          isActive
                            ? 'bg-blue-600/40 text-blue-200 border border-blue-400/40'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Active Bar indicator */}
                {isActive && (
                  <div className="absolute right-0 top-2 bottom-2 w-1 bg-blue-500 rounded-l" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Footer Status Box */}
        <div className="p-4 border-t border-slate-800 text-xs bg-slate-950/40">
          {!isCollapsed || isMobileOpen ? (
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs">System Status:</span>
              <span className="flex items-center text-emerald-400 font-semibold text-xs">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Operational
              </span>
            </div>
          ) : (
            <div className="flex justify-center" title="System Status: Operational">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
