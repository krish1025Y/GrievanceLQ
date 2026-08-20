import React, { useState, useMemo, useRef } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, NavTabId } from './components/common/Sidebar';
import { FilterBar } from './components/common/FilterBar';
import { DetailDrawer } from './components/common/DetailDrawer';
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
import { WhatsAppBotIntake } from './pages/WhatsAppBotIntake';

import {
  generateRealisticGrievances,
  SLA_ALERTS_DATA,
  RECOMMENDATIONS_DATA
} from './data/mockData';
import { GrievanceRecord, GlobalFilterState, CaseStatus } from './types';
import { AppLanguage } from './utils/translations';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>('en');
  const mainScrollRef = useRef<HTMLElement>(null);

  // Modals & Drawers
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceRecord | null>(null);

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

  // Add new grievance dynamically (from WhatsApp AI Bot)
  const handleAddGrievance = (newGrv: GrievanceRecord) => {
    setGrievanceData((prev) => [newGrv, ...prev]);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        alerts={SLA_ALERTS_DATA}
        grievances={grievanceData}
        onSelectGrievance={(grv) => setSelectedGrievance(grv)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        language={language}
        onLanguageChange={setLanguage}
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
          language={language}
        />

        {/* Right Scrollable Content View */}
        <main
          ref={mainScrollRef}
          id="main-viewport-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[1700px] mx-auto w-full"
        >
          {/* Global Filter Bar (Hidden on WhatsApp Bot tab for focused experience) */}
          {activeTab !== 'whatsapp_bot' && (
            <FilterBar
              filters={globalFilters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              totalFilteredCount={filteredGrievances.length}
            />
          )}

          {/* Active View Rendering */}
          {activeTab === 'overview' && (
            <ExecutiveOverview
              onSelectGrievance={(grv) => setSelectedGrievance(grv)}
              grievances={filteredGrievances}
              onNavigateTab={(tab) => handleTabChange(tab)}
              language={language}
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
              language={language}
            />
          )}

          {activeTab === 'whatsapp_bot' && (
            <WhatsAppBotIntake
              onAddGrievance={handleAddGrievance}
              onSelectGrievance={(grv) => {
                setSelectedGrievance(grv);
                setActiveTab('grievances');
              }}
              language={language}
            />
          )}

          {(activeTab === 'insights' ||
            activeTab === 'predictive' ||
            activeTab === 'bottleneck' ||
            activeTab === 'recommendations' ||
            activeTab === 'department' ||
            activeTab === 'sentiment') && (
            <PredictiveAnalytics language={language} />
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

      {/* Export Briefing Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default App;
