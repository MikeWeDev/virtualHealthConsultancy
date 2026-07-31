import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const server = res.socket?.server;

  if (!server || !res.socket) {
    res.status(500).end('Socket not available');
    return;
  }

  if (server.videoIo) {
    console.log('✅ Socket.io server already running');
    res.end();
    return;
  }

  console.log('🚀 Starting new Socket.io server...');

  const io = new Server(server, {
    path: '/api/video/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  server.videoIo = io;

  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('join', async (roomId) => {
      console.log(`👤 ${socket.id} joined room: ${roomId}`);
      socket.data.roomId = roomId;
      socket.join(roomId);

      // 👇 Count how many sockets are currently in the room
      const clients = await io.in(roomId).allSockets();

      if (clients.size === 1) {
        console.log(`🧭 ${socket.id} is the initiator`);
        socket.emit('you-are-initiator');
      } else {
        console.log(`📨 Notifying other clients that ${socket.id} joined`);
        socket.to(roomId).emit('user-joined');
      }

      // WebRTC signal relay
      socket.on('webrtc-signal', (data) => {
        socket.to(roomId).emit('webrtc-signal', data);
      });

      socket.on('leave', () => {
        console.log(`👋 ${socket.id} left room: ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit('user-left');
      });

      socket.on('disconnect', () => {
        console.log(`🔴 ${socket.id} disconnected from room: ${roomId}`);
        socket.to(roomId).emit('user-left');
      });
    });
  });

  res.end();
}
