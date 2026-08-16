import { Notification, NotificationType } from '../models/Notification';
import { getIO } from '../socket/socketHandler';
import { Types } from 'mongoose';

export async function createNotification(params: {
  userId: string | Types.ObjectId;
  websiteId?: string | Types.ObjectId;
  incidentId?: string | Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
}) {
  try {
    const notification = await Notification.create({
      userId: params.userId,
      websiteId: params.websiteId,
      incidentId: params.incidentId,
      title: params.title,
      message: params.message,
      type: params.type,
      read: false,
      timestamp: new Date(),
    });

    const io = getIO();
    if (io) {
      io.to(`user:${params.userId.toString()}`).emit('notification:new', notification);
      io.emit('global:alert', notification);
    }

    return notification;
  } catch (error) {
    console.error('[NotificationService] Error creating notification:', error);
  }
}
