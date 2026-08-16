export type CheckStatus = 'up' | 'down' | 'degraded' | 'unknown';
export type IncidentSeverity = 'critical' | 'warning';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentType = 'downtime' | 'dns_failure' | 'ssl_expiry' | 'high_latency';
export type NotificationType = 'down' | 'recovered' | 'ssl_expiring' | 'degraded' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Website {
  _id: string;
  name: string;
  url: string;
  checkIntervalSeconds: number;
  timeoutMs: number;
  expectedStatusCode: number;
  responseTimeThresholdMs: number;
  tags: string[];
  isPaused: boolean;
  createdBy: string;
  regions: string[];
  lastCheckStatus: CheckStatus;
  lastCheckedAt?: string;
  lastResponseTimeMs?: number;
  uptimePercentage: number;
  sslDaysRemaining?: number;
  cdnProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringCheck {
  _id: string;
  websiteId: string;
  status: CheckStatus;
  statusCode?: number;
  responseTimeMs: number;
  dnsLookupTimeMs: number;
  ttfbMs: number;
  sslDaysRemaining?: number;
  redirectChain: string[];
  headers: Record<string, string>;
  cdnProvider?: string;
  region: string;
  errorMessage?: string;
  timestamp: string;
}

export interface IncidentTimeline {
  timestamp: string;
  status: IncidentStatus;
  message: string;
}

export interface Incident {
  _id: string;
  websiteId: { _id: string; name: string; url: string } | string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  cause: string;
  startedAt: string;
  resolvedAt?: string;
  timeline: IncidentTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  websiteId?: { _id: string; name: string; url: string } | string;
  incidentId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
}

export interface DashboardStats {
  total: number;
  online: number;
  offline: number;
  degraded: number;
  paused: number;
  avgUptime: number;
  avgResponseTime: number;
  activeIncidentsCount: number;
  sslExpiringSoon: number;
}

export interface RegionNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  code: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  totalMonitored: number;
}

export interface Settings {
  _id: string;
  userId: string;
  emailNotifications: boolean;
  webhookUrl?: string;
  slackWebhookUrl?: string;
  checkIntervalDefault: number;
  darkTheme: boolean;
}
