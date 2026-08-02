// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.chatIo) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  console.log("Starting new Socket.io server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  res.socket.server.chatIo = io;

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    let currentRoom = null;

    socket.on("join", (roomId) => {
      if (currentRoom) {
        socket.leave(currentRoom);
        socket.to(currentRoom).emit("user-left", socket.id);
      }

      socket.join(roomId);
      currentRoom = roomId;
      console.log(`Socket ${socket.id} joined ${roomId}`);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("leave", (roomId) => {
      if (!roomId || !currentRoom) return;
      if (roomId !== currentRoom) return;
      socket.leave(currentRoom);
      socket.to(currentRoom).emit("user-left", socket.id);
      currentRoom = null;
    });

    socket.on("signal", (msg) => {
      console.log(`Received signal from ${socket.id} in room ${currentRoom}:`, msg?.id);
      if (currentRoom) {
        socket.to(currentRoom).emit("signal", msg);
      } else {
        console.error(`Socket ${socket.id} sent message without joining room`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
      if (currentRoom) {
        socket.to(currentRoom).emit("user-left", socket.id);
      }
    });
  });

  res.end();
}