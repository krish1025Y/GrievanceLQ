export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type CaseStatus = 'Registered' | 'Under Review' | 'Investigation' | 'Action Taken' | 'Resolved' | 'Appealed' | 'Closed';
export type SLAStatus = 'On Track' | 'At Risk' | 'Critical' | 'Breached';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stage: string;
  actor: string;
  role: string;
  description: string;
  actionTaken?: string;
  statusChange?: CaseStatus;
}

export interface GrievanceRecord {
  id: string;
  registrationNumber: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  state: string;
  district: string;
  ministry: string;
  department: string;
  subDepartment: string;
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  priority: PriorityLevel;
  status: CaseStatus;
  slaDeadline: string; // ISO date string
  slaRemainingMinutes: number; // calculated / updated
  slaStatus: SLAStatus;
  assignedOfficer: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    avatar: string;
  };
  createdDate: string;
  lastUpdated: string;
  resolutionDate?: string;
  predictedRisk: RiskLevel;
  predictedRiskScore: number; // 0-100
  sentiment: SentimentType;
  sentimentScore: number; // -1.0 to +1.0
  sentimentKeywords: string[];
  prematureClosureRisk: boolean;
  prematureClosureScore?: number;
  citizenFeedback?: {
    rating: number; // 1-5
    comment: string;
    feedbackDate: string;
  };
  appealCount: number;
  recommendedAction: string;
  timeline: TimelineEvent[];
}

export interface DepartmentMetric {
  id: string;
  name: string;
  shortName: string;
  ministry: string;
  totalGrievances: number;
  resolved: number;
  pending: number;
  underReview: number;
  resolutionRatePct: number;
  avgResolutionDays: number;
  slaCompliancePct: number;
  appealRatePct: number;
  citizenSatisfactionPct: number;
  performanceScore: number; // 0-100
  prematureClosureRatePct: number;
  trend: 'up' | 'down' | 'neutral';
  officersCount: number;
  highRiskCases: number;
  topCategories: { category: string; count: number }[];
}

export interface DistrictMetric {
  districtName: string;
  stateName: string;
  totalGrievances: number;
  pendingLoad: number;
  resolvedCount: number;
  resolutionRatePct: number;
  slaCompliancePct: number;
  slaBreachCount: number;
  avgResolutionDays: number;
  sentimentScore: number;
  riskLevel: RiskLevel;
  predictedHotspot: boolean;
  topIssue: string;
  nodalOfficer: string;
}

export interface StateMetric {
  stateCode: string;
  stateName: string;
  totalGrievances: number;
  pendingLoad: number;
  resolvedCount: number;
  slaCompliancePct: number;
  slaBreaches: number;
  avgResolutionDays: number;
  sentimentScore: number; // -1 to 1
  riskLevel: RiskLevel;
  isPredictedHotspot: boolean;
  districtsCount: number;
  topDepartment: string;
  districts: DistrictMetric[];
}

export interface BottleneckItem {
  id: string;
  rank: number;
  department: string;
  subDepartment: string;
  severityScore: number; // 0-100
  severityBadge: 'Critical' | 'High' | 'Medium' | 'Low';
  rootCause: string;
  avgDelayDays: number;
  pendingLoad: number;
  periodChangePct: number;
  slaImpact: string;
  recommendedAction: string;
  explanation: string;
  activeOfficers: number;
  dailyIngestionRate: number;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: 'Resource Allocation' | 'SLA Escalation' | 'Quality & Reopen' | 'Seasonal Prep' | 'Policy Reform';
  impact: 'Critical' | 'High' | 'Medium';
  urgency: 'Immediate' | 'Within 48h' | 'This Week' | 'Strategic';
  confidencePct: number;
  expectedBenefit: string;
  affectedDepartment: string;
  affectedDistrict: string;
  reason: string;
  status: 'Active' | 'Assigned' | 'In Progress' | 'Completed' | 'Dismissed';
  evidence: string[];
  suggestedActionType: string;
}

export interface SLABreachAlert {
  id: string;
  grievanceId: string;
  registrationNumber: string;
  department: string;
  district: string;
  state: string;
  category: string;
  priority: PriorityLevel;
  remainingMinutes: number;
  timeDisplay: string;
  assignedOfficer: string;
  riskLevel: RiskLevel;
  status: SLAStatus;
  alertTimestamp: string;
  description: string;
}

export interface PrematureClosureRecord {
  department: string;
  ministry: string;
  totalClosed: number;
  prematureClosures: number;
  closureRatePct: number;
  citizenReopenRatePct: number;
  sentimentAfterClosure: 'Negative' | 'Strongly Negative' | 'Neutral';
  riskLevel: RiskLevel;
  primarySubReason: string;
}

export interface SentimentKeyword {
  keyword: string;
  category: string;
  occurrences: number;
  sentiment: SentimentType;
  avgScore: number;
  growthPct: number;
  sampleGrievanceIds: string[];
}

export interface GlobalFilterState {
  dateRange: 'today' | '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  state: string;
  district: string;
  department: string;
  category: string;
  priority: string;
  status: string;
  riskLevel: string;
  searchQuery: string;
}

export interface GeneratedReportItem {
  id: string;
  name: string;
  type: string;
  generatedDate: string;
  format: 'PDF' | 'CSV' | 'JSON';
  fileSize: string;
  author: string;
}

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
