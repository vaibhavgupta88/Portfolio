import { Schema, model, Document } from 'mongoose';

export interface ISettings extends Document {
  userId: Schema.Types.ObjectId;
  emailNotifications: boolean;
  webhookUrl?: string;
  slackWebhookUrl?: string;
  checkIntervalDefault: number;
  darkTheme: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    emailNotifications: { type: Boolean, default: true },
    webhookUrl: { type: String, default: '' },
    slackWebhookUrl: { type: String, default: '' },
    checkIntervalDefault: { type: Number, default: 60 },
    darkTheme: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>('Settings', SettingsSchema);
