// /pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

// Extend the type of res.socket to add our .io property
declare module 'net' {
  interface Socket {
    server?: NetServer & {
      io?: SocketIOServer;
    };
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket) {
    res.status(500).end();
    return;
  }

  if (!res.socket.server) {
    res.status(500).end();
    return;
  }

  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');

    // Cast socket.server to NetServer with .io property
    const httpServer = res.socket.server as NetServer;

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
        if (message.roomId) {
          socket.to(message.roomId).emit('signal', message);
        }
      });

      socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
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
