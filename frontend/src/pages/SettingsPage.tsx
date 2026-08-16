import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import { Settings as SettingsIcon, Bell, Webhook, User, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    webhookUrl: '',
    slackWebhookUrl: '',
    checkIntervalDefault: 60,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/users/settings');
        if (res.data.settings) setSettings(res.data.settings);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/settings', settings);
      const userRes = await api.put('/users/profile', { name: profileName, email: profileEmail });
      if (userRes.data.user) updateUser(userRes.data.user);

      addToast({
        title: 'Settings Saved',
        message: 'Your system preferences and webhook dispatches have been updated.',
        type: 'recovered',
      });
    } catch (err: any) {
      addToast({
        title: 'Error Saving Settings',
        message: err.response?.data?.error || 'Failed to update settings',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Integrations</h1>
        <p className="text-xs text-slate-400 mt-1">Configure automated webhook dispatches, Slack alerts, and engineer profile</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Engineer Profile Section */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Engineer Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Outage Alerts & Webhook Integration */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Webhook className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Outage Webhooks & Alert Routing</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Custom HTTP Webhook Endpoint</label>
              <input
                type="url"
                placeholder="https://api.yourdomain.com/webhooks/resilience"
                value={settings.webhookUrl || ''}
                onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slack Incoming Webhook URL</label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXX"
                value={settings.slackWebhookUrl || ''}
                onChange={(e) => setSettings({ ...settings, slackWebhookUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono transition"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="emailNotif"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="emailNotif" className="text-xs text-slate-300 font-medium">
                Dispatch immediate email notifications when a service goes down or recovers
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-glow transition disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
