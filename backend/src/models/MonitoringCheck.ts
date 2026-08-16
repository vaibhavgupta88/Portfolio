import { Schema, model, Document } from 'mongoose';
import { CheckStatus } from './Website';

export interface IMonitoringCheck extends Document {
  websiteId: Schema.Types.ObjectId;
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
  timestamp: Date;
}

const MonitoringCheckSchema = new Schema<IMonitoringCheck>(
  {
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website', required: true, index: true },
    status: { type: String, enum: ['up', 'down', 'degraded', 'unknown'], required: true },
    statusCode: { type: Number },
    responseTimeMs: { type: Number, required: true },
    dnsLookupTimeMs: { type: Number, default: 0 },
    ttfbMs: { type: Number, default: 0 },
    sslDaysRemaining: { type: Number },
    redirectChain: [{ type: String }],
    headers: { type: Schema.Types.Mixed, default: {} },
    cdnProvider: { type: String },
    region: { type: String, default: 'us-east' },
    errorMessage: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const MonitoringCheck = model<IMonitoringCheck>('MonitoringCheck', MonitoringCheckSchema);
