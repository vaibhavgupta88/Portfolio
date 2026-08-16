import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, Info, X } from 'lucide-react';

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'down' | 'recovered' | 'ssl_expiring' | 'degraded' | 'error' | 'info';
}

interface NotificationContextType {
  addToast: (toast: Omit<ToastAlert, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const { socket } = useSocket();

  const addToast = (toast: Omit<ToastAlert, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (notif: any) => {
      addToast({
        title: notif.title,
        message: notif.message,
        type: notif.type,
      });
    });

    socket.on('global:alert', (notif: any) => {
      addToast({
        title: notif.title,
        message: notif.message,
        type: notif.type,
      });
    });

    return () => {
      socket.off('notification:new');
      socket.off('global:alert');
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${
                toast.type === 'down'
                  ? 'bg-rose-950/80 border-rose-800/60 text-rose-200'
                  : toast.type === 'recovered'
                  ? 'bg-emerald-950/80 border-emerald-800/60 text-emerald-200'
                  : toast.type === 'degraded' || toast.type === 'ssl_expiring'
                  ? 'bg-amber-950/80 border-amber-800/60 text-amber-200'
                  : 'bg-slate-900/90 border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'down' ? (
                  <XCircle className="w-5 h-5 text-rose-400" />
                ) : toast.type === 'recovered' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : toast.type === 'degraded' || toast.type === 'ssl_expiring' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-indigo-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-snug">{toast.title}</h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
