import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      if (user) {
        socketInstance.emit('join:user', user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
