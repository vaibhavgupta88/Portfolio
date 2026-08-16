import React, { useState } from 'react';
import { X, Globe, Sliders, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    checkIntervalSeconds: 60,
    responseTimeThresholdMs: 1500,
    expectedStatusCode: 200,
    tags: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) return;

    setLoading(true);
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await api.post('/websites', {
        name: formData.name,
        url: formData.url,
        checkIntervalSeconds: Number(formData.checkIntervalSeconds),
        responseTimeThresholdMs: Number(formData.responseTimeThresholdMs),
        expectedStatusCode: Number(formData.expectedStatusCode),
        tags: tagsArray,
      });

      addToast({
        title: 'Website Added',
        message: `${formData.name} is now actively monitored across global regions.`,
        type: 'recovered',
      });

      setFormData({
        name: '',
        url: '',
        checkIntervalSeconds: 60,
        responseTimeThresholdMs: 1500,
        expectedStatusCode: 200,
        tags: '',
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      addToast({
        title: 'Error Adding Website',
        message: err.response?.data?.error || 'Failed to add website',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Monitor New Endpoint</h3>
              <p className="text-xs text-slate-400">Configure global health tracking for your web service</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website Name</label>
            <input
              type="text"
              placeholder="e.g. Primary Production API"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Endpoint URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expected Status Code</label>
              <input
                type="number"
                value={formData.expectedStatusCode}
                onChange={(e) => setFormData({ ...formData, expectedStatusCode: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Latency Alert Threshold (ms)</label>
              <input
                type="number"
                value={formData.responseTimeThresholdMs}
                onChange={(e) => setFormData({ ...formData, responseTimeThresholdMs: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="production, api, us-east"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-glow transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Start Monitoring'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
