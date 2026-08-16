import React, { useState, useEffect } from 'react';
import { WebsiteCard } from '../components/website/WebsiteCard';
import { Website } from '../types';
import { api } from '../services/api';
import { Search, Plus, Filter, Globe, MonitorCheck } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export const WebsitesPage: React.FC = () => {
  const { openAddModal } = useOutletContext<{ openAddModal: () => void }>();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchWebsites = async () => {
    try {
      let query = `/websites?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (statusFilter !== 'all') query += `status=${statusFilter}&`;

      const res = await api.get(query);
      if (res.data.websites) setWebsites(res.data.websites);
    } catch (err) {
      console.error('Error fetching websites list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Monitored Web Services</h1>
          <p className="text-xs text-slate-400 mt-1">Manage active HTTP targets and latency SLA thresholds</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Endpoint</span>
        </button>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'up', 'down', 'degraded', 'paused'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-900 rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      ) : websites.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <MonitorCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Monitored Endpoints Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by adding your first website or web API endpoint to track uptime and response latency.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            <Plus className="w-4 h-4" /> Add Website Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <WebsiteCard key={website._id} website={website} onRefresh={fetchWebsites} />
          ))}
        </div>
      )}
    </div>
  );
};
