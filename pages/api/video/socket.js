import { Server } from 'socket.io';

export default function handler(req, res) {
  // Check if Socket.io server is already initialized
  if (!res.socket.server.io) {
    console.log('🚀 Starting Socket.io server...');

    const io = new Server(res.socket.server, {
      path: '/api/video/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*', // TODO: restrict in production
        methods: ['GET', 'POST'],
      },
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('🟢 Socket connected:', socket.id);

      socket.on('join', (roomId) => {
        socket.join(roomId);
        const room = io.sockets.adapter.rooms.get(roomId);

        console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);

        // Notify room if 2 users connected
        if (room && room.size === 2) {
          io.to(roomId).emit('ready');
        }
      });

      socket.on('webrtc-signal', (data) => {
        const { roomId } = data;
        socket.to(roomId).emit('webrtc-signal', data);
      });

      socket.on('leave', (roomId) => {
        socket.leave(roomId);
        console.log(`👋 Socket ${socket.id} left room: ${roomId}`);
        socket.to(roomId).emit('user-left');
      });

      socket.on('disconnect', () => {
        console.log('🔴 Socket disconnected:', socket.id);
        // Notify all rooms the socket was part of except own room
        socket.rooms.forEach((roomId) => {
          if (roomId !== socket.id) {
            socket.to(roomId).emit('user-left');
          }
        });
      });
    });
  } else {
    console.log('✅ Socket.io server already running');
  }

  res.end();
}
