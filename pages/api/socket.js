// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  console.log("Starting new Socket.io server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    let currentRoom = null;

    socket.on("join", (roomId) => {
      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        socket.to(currentRoom).emit("user-left", socket.id);
      }
      
      // Join new room
      socket.join(roomId);
      currentRoom = roomId;
      console.log(`Socket ${socket.id} joined ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("signal", (msg) => {
      console.log(`Received signal from ${socket.id} in room ${currentRoom}:`, msg.id);
      
      if (currentRoom) {
        // Broadcast to everyone in the room except the sender
        socket.to(currentRoom).emit("signal", msg);
        
        // Also send to sender (for consistency)
        socket.emit("signal", msg);
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