import { Server } from 'socket.io';

export default function handler(req, res) {
  const socket = res.socket;

  if (!socket) {
    res.status(500).send("Socket is not available");
    return;
  }

  if (socket.server.io) {
    console.log("✅ Socket.io server already running");
    res.end();
    return;
  }

  console.log("🚀 Starting new Socket.io server...");

  const io = new Server(socket.server, {
    path: "/api/video/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*", // You may restrict this in production
      methods: ["GET", "POST"]
    }
  });

  socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("🟢 New socket connection:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`👤 Socket ${socket.id} joined room: ${roomId}`);

      // Notify existing users that someone new joined
      socket.to(roomId).emit("user-joined");

      // Relay WebRTC signaling messages (offer, answer, candidate)
      socket.on("webrtc-signal", (data) => {
        socket.to(roomId).emit("webrtc-signal", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`🔴 Socket ${socket.id} disconnected from room: ${roomId}`);
        socket.to(roomId).emit("user-left", socket.id);
      });
    });

    // Optional: handle manual leave
    socket.on("leave", (roomId) => {
      socket.leave(roomId);
      console.log(`👋 Socket ${socket.id} manually left room: ${roomId}`);
      socket.to(roomId).emit("user-left", socket.id);
    });
  });

  res.end();
}
