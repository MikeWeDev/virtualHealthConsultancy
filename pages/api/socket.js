import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  console.log("Starting new Socket.io server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      // Notify others in the room that a user joined
      socket.to(roomId).emit("user-joined");

      // Broadcast 'signal' event to everyone in the room, including sender
      socket.on("signal", (data) => {
        io.to(roomId).emit("signal", data);
      });

      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} left room: ${roomId}`);
        socket.to(roomId).emit("user-left");
      });
    });
  });

  res.end();
}
