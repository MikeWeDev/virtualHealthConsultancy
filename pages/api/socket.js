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

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined ${roomId}`);
      
      socket.on("signal", (msg) => {
        io.to(roomId).emit("signal", msg);
      });
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  res.end();
}