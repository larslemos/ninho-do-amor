export interface WeddingAnalytics {
  id: string;
  weddingId: string;
  period: AnalyticsPeriod;
  metrics: WeddingMetrics;
  trends: TrendData[];
  reports: GeneratedReport[];
  alerts: AnalyticsAlert[];
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'total';

export interface WeddingMetrics {
  guests: GuestMetrics;
  rsvp: RSVPMetrics;
  engagement: EngagementMetrics;
  financial: FinancialMetrics;
  photos: PhotoMetrics;
  events: EventMetrics;
  communication: CommunicationMetrics;
}

export interface GuestMetrics {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
  byRelationship: CategoryData[];
  byProvince: CategoryData[];
  bySide: CategoryData[];
  byAge: CategoryData[];
  withEmail: number;
  withPhone: number;
  needingTransport: number;
  withDietaryRestrictions: number;
  withAccompanying: number;
  invitationsSent: number;
  invitationsOpened: number;
  conversionRate: number;
}

export interface RSVPMetrics {
  responseRate: number;
  averageResponseTime: number;
  responsesByDay: Record<string, number>;
  responsesByEvent: Record<string, number>;
  lateResponses: number;
  changedResponses: number;
  remindersSent: number;
  reminderEffectiveness: number;
}

export interface EngagementMetrics {
  websiteVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  deviceTypes: CategoryData[];
  trafficSources: CategoryData[];
  popularPages: PageAnalytics[];
  conversionRate: number;
}

export interface FinancialMetrics {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  byCategory: BudgetCategory[];
  monthlySpending: ChartDataPoint[];
  projectedTotal: number;
  overBudgetCategories: string[];
}

export interface PhotoMetrics {
  totalPhotos: number;
  photosByEvent: EventPhotoData[];
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  topPhotos: PhotoData[];
  uploadTrend: ChartDataPoint[];
  moderationQueue: number;
}

export interface EventMetrics {
  eventCompletionRate: Record<string, number>;
  attendanceByEvent: Record<string, number>;
  eventDuration: Record<string, number>;
  eventSatisfaction: Record<string, number>;
  eventCosts: Record<string, number>;
}

export interface CommunicationMetrics {
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  emailsClicked: number;
  emailOpenRate: number;
  emailClickRate: number;
  smsSent: number;
  smsDelivered: number;
  smsRead: number;
  whatsappSent: number;
  whatsappDelivered: number;
  whatsappRead: number;
  whatsappReplied: number;
}

export interface TrendData {
  metric: string;
  period: string;
  value: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GeneratedReport {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  generatedAt: string;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl: string;
  size: number;
  parameters: Record<string, any>;
}

export type ReportType =
  | 'guest-list'
  | 'rsvp-summary'
  | 'financial-summary'
  | 'vendor-contacts'
  | 'table-assignments'
  | 'timeline-schedule'
  | 'photo-gallery'
  | 'engagement-report'
  | 'final-summary';

export interface AnalyticsAlert {
  id: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  createdAt: string;
  acknowledged: boolean;
  actionRequired: boolean;
}

export type AlertType =
  | 'low-rsvp-rate'
  | 'budget-overrun'
  | 'deadline-approaching'
  | 'low-engagement'
  | 'technical-issue'
  | 'capacity-exceeded'
  | 'vendor-delay';

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  events: string[];
  guestCategories: string[];
  metrics: string[];
}

export interface ComparisonData {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
}

export interface ChartDataPoint {
  date: string;
  [key: string]: any;
}

export interface GuestAnalytics {
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
  rejectedGuests: number;
  responseRate: number;
  averageResponseTime: number;
  byRelationship: CategoryData[];
  byProvince: CategoryData[];
  bySide: CategoryData[];
  byAge: CategoryData[];
  withDietaryRestrictions: number;
  withAccompanying: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface BudgetAnalytics {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  spentPercentage: number;
  byCategory: BudgetCategory[];
  monthlySpending: ChartDataPoint[];
  projectedTotal: number;
  overBudgetCategories: string[];
}

export interface BudgetCategory {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
}

export interface PageAnalytics {
  page: string;
  visits: number;
  averageTime: number;
  bounceRate: number;
}

export interface EventPhotoData {
  eventType: string;
  photoCount: number;
  likes: number;
  shares: number;
  comments: number;
}

export interface PhotoData {
  id: string;
  url: string;
  likes: number;
  shares: number;
  comments: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notifications: NotificationChannel[];
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  enabled: boolean;
  recipients: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'pdf' | 'excel' | 'csv';
  schedule?: ReportSchedule;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'text' | 'image';
  data: any;
  config: any;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  enabled: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'progress';
  title: string;
  data: any;
  config: WidgetConfig;
  position: { x: number; y: number; width: number; height: number };
}

export interface WidgetConfig {
  refreshInterval?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  dateRange?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface GeographicData {
  province: string;
  city?: string;
  coordinates?: [number, number];
  value: number;
  percentage: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
  throughput: number;
}
