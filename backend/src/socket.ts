import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { Client as PGClient } from 'pg';

let io: SocketIOServer | null = null;

// Function to initialize the Socket.IO instance
export const initSocket = (server: http.Server): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Adjust this for security in production
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });

  // Initialize PostgreSQL client and listen for notifications
  initPGListener();

  return io;
};

// Function to get the initialized Socket.IO instance
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Function to initialize PostgreSQL listener
const initPGListener = () => {
  const pgClient = new PGClient({
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  pgClient.connect((err) => {
    if (err) {
      console.error('Error connecting to PostgreSQL:', err);
      return;
    }
    console.log('Connected to PostgreSQL for notifications.');

    // Listen to the specific channel for production order updates
    pgClient.query('LISTEN production_order_update');

    // Handle incoming notifications
    pgClient.on('notification', (msg) => {
      if (msg.channel === 'production_order_update' && msg.payload) {
        const updatedOrder = JSON.parse(msg.payload);
        if (io) {
          io.emit('productionOrderUpdated', updatedOrder);
        }
      }
    });

    // Handle errors
    pgClient.on('error', (err) => {
      console.error('PostgreSQL client error:', err);
      pgClient.end();
    });
  });
};
