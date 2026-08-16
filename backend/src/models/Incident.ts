import { Schema, model, Document } from 'mongoose';

export type IncidentSeverity = 'critical' | 'warning';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentType = 'downtime' | 'dns_failure' | 'ssl_expiry' | 'high_latency';

export interface IIncidentTimeline {
  timestamp: Date;
  status: IncidentStatus;
  message: string;
}

export interface IIncident extends Document {
  websiteId: Schema.Types.ObjectId;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  cause: string;
  startedAt: Date;
  resolvedAt?: Date;
  timeline: IIncidentTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website', required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['downtime', 'dns_failure', 'ssl_expiry', 'high_latency'], required: true },
    severity: { type: String, enum: ['critical', 'warning'], default: 'critical' },
    status: { type: String, enum: ['investigating', 'identified', 'monitoring', 'resolved'], default: 'investigating' },
    cause: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    timeline: [
      {
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['investigating', 'identified', 'monitoring', 'resolved'], required: true },
        message: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Incident = model<IIncident>('Incident', IncidentSchema);
