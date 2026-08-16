import React, { useState, useEffect } from 'react';
import { NotificationItem } from '../types';
import { api } from '../services/api';
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.notifications) setNotifications(res.data.notifications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read/all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alert dispatch log for network resilience events</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 border border-slate-700/80 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 animate-pulse">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Notifications</h3>
          <p className="text-xs text-slate-400">You are all caught up! No unread system alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-xl border transition flex items-start gap-4 ${
                notif.read ? 'bg-slate-900/40 border-slate-800/80 text-slate-300' : 'bg-slate-900/90 border-indigo-500/40 text-white shadow-glow'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {notif.type === 'down' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : notif.type === 'recovered' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Info className="w-5 h-5 text-indigo-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold">{notif.title}</h4>
                  <span className="text-[11px] text-slate-500">{new Date(notif.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
