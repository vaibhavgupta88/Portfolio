import { Schema, model, Document } from 'mongoose';

export type CheckStatus = 'up' | 'down' | 'degraded' | 'unknown';

export interface IWebsite extends Document {
  name: string;
  url: string;
  checkIntervalSeconds: number;
  timeoutMs: number;
  expectedStatusCode: number;
  responseTimeThresholdMs: number;
  tags: string[];
  isPaused: boolean;
  createdBy: Schema.Types.ObjectId;
  regions: string[];
  lastCheckStatus: CheckStatus;
  lastCheckedAt?: Date;
  lastResponseTimeMs?: number;
  uptimePercentage: number;
  sslDaysRemaining?: number;
  cdnProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSchema = new Schema<IWebsite>(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    checkIntervalSeconds: { type: Number, default: 60 },
    timeoutMs: { type: Number, default: 10000 },
    expectedStatusCode: { type: Number, default: 200 },
    responseTimeThresholdMs: { type: Number, default: 1500 },
    tags: [{ type: String, trim: true }],
    isPaused: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    regions: { type: [String], default: ['us-east', 'us-west', 'eu-west', 'ap-south'] },
    lastCheckStatus: { type: String, enum: ['up', 'down', 'degraded', 'unknown'], default: 'unknown' },
    lastCheckedAt: { type: Date },
    lastResponseTimeMs: { type: Number, default: 0 },
    uptimePercentage: { type: Number, default: 100 },
    sslDaysRemaining: { type: Number },
    cdnProvider: { type: String, default: 'Direct / Standard' },
  },
  { timestamps: true }
);

export const Website = model<IWebsite>('Website', WebsiteSchema);
