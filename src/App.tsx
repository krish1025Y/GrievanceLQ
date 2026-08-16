import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, NavTabId } from './components/common/Sidebar';
import { FilterBar } from './components/common/FilterBar';
import { DetailDrawer } from './components/common/DetailDrawer';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { ExportModal } from './components/common/ExportModal';

import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { GrievanceManagement } from './pages/GrievanceManagement';
import { SLAMonitoring } from './pages/SLAMonitoring';
import { DistrictIntelligence } from './pages/DistrictIntelligence';
import { DepartmentPerformance } from './pages/DepartmentPerformance';
import { CitizenSentiment } from './pages/CitizenSentiment';
import { PredictiveAnalytics } from './pages/PredictiveAnalytics';
import { BottleneckDetection } from './pages/BottleneckDetection';
import { Recommendations } from './pages/Recommendations';
import { Reports } from './pages/Reports';
import { SettingsPage } from './pages/Settings';

import {
  generateRealisticGrievances,
  SLA_ALERTS_DATA,
  RECOMMENDATIONS_DATA
} from './data/mockData';
import { GrievanceRecord, GlobalFilterState, CaseStatus } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mainScrollRef = useRef<HTMLElement>(null);

  // Modals & Drawers
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

  // Live Refresh simulation
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(12);

  // Grievance dataset state
  const [grievanceData, setGrievanceData] = useState<GrievanceRecord[]>(() => generateRealisticGrievances());

  // Global Filters
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>({
    dateRange: '30d',
    state: '',
    district: '',
    department: '',
    category: '',
    priority: '',
    status: '',
    riskLevel: '',
  });

  // Seconds ticker for data freshness indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSeconds((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setGrievanceData(generateRealisticGrievances());
      setIsRefreshing(false);
      setLastUpdatedSeconds(0);
    }, 600);
  };

  const handleFilterChange = (newFilters: Partial<GlobalFilterState>) => {
    setGlobalFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setGlobalFilters({
      dateRange: '30d',
      state: '',
      district: '',
      department: '',
      category: '',
      priority: '',
      status: '',
      riskLevel: '',
    });
  };

  // Filtered dataset according to Global Filters
  const filteredGrievances = useMemo(() => {
    return grievanceData.filter((g) => {
      if (globalFilters.state && g.state !== globalFilters.state) return false;
      if (globalFilters.district && g.district !== globalFilters.district) return false;
      if (globalFilters.department && g.department !== globalFilters.department) return false;
      if (globalFilters.priority && g.priority !== globalFilters.priority) return false;
      if (globalFilters.status && g.status !== globalFilters.status) return false;
      if (globalFilters.riskLevel && g.predictedRisk !== globalFilters.riskLevel) return false;
      return true;
    });
  }, [grievanceData, globalFilters]);

  // Case updates
  const handleUpdateStatus = (id: string, newStatus: CaseStatus) => {
    setGrievanceData((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = {
            ...g,
            status: newStatus,
            timeline: [
              ...g.timeline,
              {
                id: `tl-${Date.now()}`,
                date: new Date().toISOString().slice(0, 10),
                title: `Status Changed to ${newStatus}`,
                description: `Executive order recorded. Case updated to ${newStatus}.`,
                actor: 'Dr. Rajiv Gauba, IAS (Cabinet Secretariat)',
                type: newStatus === 'Resolved' ? 'resolution' : 'action',
              },
            ],
          };
          if (selectedGrievance?.id === id) {
            setSelectedGrievance(updated);
          }
          return updated;
        }
        return g;
      })
    );
  };

  const handleBulkStatusChange = (ids: string[], newStatus: CaseStatus) => {
    setGrievanceData((prev) =>
      prev.map((g) => (ids.includes(g.id) ? { ...g, status: newStatus } : g))
    );
  };

  const handleTabChange = (tab: NavTabId) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Counts for sidebar badges
  const slaBreachCount = grievanceData.filter(
    (g) => g.slaStatus === 'Breached' || g.slaStatus === 'Critical'
  ).length;
  const criticalCasesCount = grievanceData.filter((g) => g.predictedRisk === 'Critical').length;
  const pendingRecommendations = RECOMMENDATIONS_DATA.filter((r) => r.status === 'Active').length;

  const topTabItems: { id: NavTabId; label: string; icon?: string }[] = [
    { id: 'overview', label: 'Executive Overview' },
    { id: 'maps', label: 'Geospatial Maps' },
    { id: 'grievances', label: 'Grievance Directory' },
    { id: 'insights', label: 'AI & Predictive Insights' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        alerts={SLA_ALERTS_DATA}
        grievances={grievanceData}
        onSelectGrievance={(grv) => setSelectedGrievance(grv)}
        onRefreshData={handleRefreshData}
        isRefreshing={isRefreshing}
        lastUpdatedSeconds={lastUpdatedSeconds}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Body Layout: Left Sidebar + Right Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          slaBreachCount={slaBreachCount}
          criticalCasesCount={criticalCasesCount}
          recommendationsCount={pendingRecommendations}
        />

        {/* Right Scrollable Content View */}
        <main
          ref={mainScrollRef}
          id="main-viewport-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full"
        >
          {/* Sleek Minimalist Primary Navigation Bar */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto">
            <nav
              aria-label="Primary Navigation Modules"
              className="flex items-center gap-1 text-xs"
            >
              {topTabItems.map((tab) => {
                const isActive =
                  activeTab === tab.id ||
                  (tab.id === 'maps' && activeTab === 'district') ||
                  (tab.id === 'insights' && (activeTab === 'predictive' || activeTab === 'bottleneck' || activeTab === 'recommendations')) ||
                  (tab.id === 'grievances' && activeTab === 'sla');

                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`top-tab-${tab.id}`}
                    data-tab={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.id === 'maps' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isActive ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'}`}>
                        Maps
                      </span>
                    )}
                    {tab.id === 'grievances' && criticalCasesCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isActive ? 'bg-blue-700 text-white' : 'bg-rose-50 text-rose-700'}`}>
                        {grievanceData.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Global Filter Bar (Accessible across views) */}
          <FilterBar
            filters={globalFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            totalFilteredCount={filteredGrievances.length}
          />

          {/* Active View Rendering */}
          {activeTab === 'overview' && (
            <ExecutiveOverview
              onSelectGrievance={(grv) => setSelectedGrievance(grv)}
              grievances={filteredGrievances}
              onNavigateTab={(tab) => handleTabChange(tab)}
            />
          )}

          {(activeTab === 'maps' || activeTab === 'district') && (
            <DistrictIntelligence
              onNavigateToGrievances={() => handleTabChange('grievances')}
            />
          )}

          {(activeTab === 'grievances' || activeTab === 'sla') && (
            <GrievanceManagement
              grievances={filteredGrievances}
              onSelectGrievance={(grv) => setSelectedGrievance(grv)}
              onBulkStatusChange={handleBulkStatusChange}
            />
          )}

          {(activeTab === 'insights' ||
            activeTab === 'predictive' ||
            activeTab === 'bottleneck' ||
            activeTab === 'recommendations' ||
            activeTab === 'department' ||
            activeTab === 'sentiment') && (
            <PredictiveAnalytics />
          )}

          {activeTab === 'reports' && (
            <Reports />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* CRM Grievance Detail Drawer */}
      <DetailDrawer
        grievance={selectedGrievance}
        isOpen={Boolean(selectedGrievance)}
        onClose={() => setSelectedGrievance(null)}
        onStatusChange={handleUpdateStatus}
      />

      {/* Reference Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Export Briefing Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default App;
