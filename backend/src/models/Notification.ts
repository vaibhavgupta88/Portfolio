import { Schema, model, Document } from 'mongoose';

export type NotificationType = 'down' | 'recovered' | 'ssl_expiring' | 'degraded' | 'error';

export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  websiteId?: Schema.Types.ObjectId;
  incidentId?: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    websiteId: { type: Schema.Types.ObjectId, ref: 'Website' },
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['down', 'recovered', 'ssl_expiring', 'degraded', 'error'], required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
