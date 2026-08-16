import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env';

let ioServer: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  ioServer = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  ioServer.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join:user', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] Socket ${socket.id} joined room user:${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioServer;
}

export function getIO(): SocketIOServer | null {
  return ioServer;
}
