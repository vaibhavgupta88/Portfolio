import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  MonitorCheck,
  AlertTriangle,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Global Resilience Map', icon: Globe, path: '/map' },
    { label: 'Monitored Sites', icon: MonitorCheck, path: '/websites' },
    { label: 'Incidents Feed', icon: AlertTriangle, path: '/incidents' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Settings & API', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#0a0d14] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Logo Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-none">ResilienceMap</h1>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">Enterprise SaaS</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-glow'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-semibold text-indigo-300 text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Engineer'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'user@domain.com'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
