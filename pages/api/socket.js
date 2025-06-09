import { Server } from 'socket.io';

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('✅ Socket.io server already running');
    res.end();
    return;
  }

  console.log('🚀 Starting new Socket.io server...');
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('📡 New socket connection:', socket.id);

    let currentRoomId: string | null = null;

    socket.on('join', (roomId: string) => {
      currentRoomId = roomId;
      socket.join(roomId);
      console.log(`🔗 Socket ${socket.id} joined room: ${roomId}`);
      socket.to(roomId).emit('user-joined', { id: socket.id });
    });

    socket.on('signal', (data) => {
      if (currentRoomId) {
        socket.to(currentRoomId).emit('signal', data); // ✅ only to others
      } else {
        console.warn('⚠️ signal sent but no room joined yet');
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Socket ${socket.id} disconnected`);
      if (currentRoomId) {
        socket.to(currentRoomId).emit('user-left', { id: socket.id });
      }
    });
  });

  res.end();
}
