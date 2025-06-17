// /pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    const httpServer = res.socket.server as unknown as NetServer;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',  // important: matches client path
      cors: {
        origin: '*',  // restrict in production
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join', (roomId: string) => {
        console.log(`Socket ${socket.id} joining room: ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', socket.id);
      });

      socket.on('signal', (message) => {
        // Broadcast to everyone in the same room except sender
        if (message.roomId) {
          socket.to(message.roomId).emit('signal', message);
        }
      });

      socket.on('disconnecting', () => {
        // Emit user-left for all rooms this socket was in
        socket.rooms.forEach((room) => {
          if (room !== socket.id) { // exclude personal socket room
            socket.to(room).emit('user-left', socket.id);
          }
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('Socket.IO server already initialized');
  }
  res.end();
};

export default SocketHandler;
