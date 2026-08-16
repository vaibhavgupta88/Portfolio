import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { Bell, Plus, FileText, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

interface NavbarProps {
  onOpenAddModal: () => void;
  onExportReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onExportReport }) => {
  const { connected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.unreadCount || 0);
      } catch (e) {
        // ignore
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0a0d14]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Real-time Network Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                connected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <span className="font-medium text-[11px] uppercase tracking-wider text-slate-400">
            {connected ? 'Socket Live' : 'Reconnecting'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span>Global Monitor Interval:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-emerald-400 font-mono font-semibold">
            60s Engine
          </span>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {onExportReport && (
          <button
            onClick={onExportReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/70 transition"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Export Report</span>
          </button>
        )}

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website</span>
        </button>

        <Link
          to="/notifications"
          className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
