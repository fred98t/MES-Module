// socket.ts
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

let io: SocketIOServer | null = null;

// Function to initialize the Socket.IO instance
export const initSocket = (server: http.Server): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // adjust this for security in production
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id);
  });

  return io;
};

// Function to get the initialized Socket.IO instance
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
