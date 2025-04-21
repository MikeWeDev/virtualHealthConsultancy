import { Server } from 'socket.io';

export default function handler(req, res) {
  // Ensure res.socket is not null
  const socket = res.socket;
  if (!socket) {
    res.status(500).send("Socket is not available");
    return;
  }

  // Check if the socket.io server is already running
  if (socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  console.log("Starting new Socket.io server...");

  // Initialize the Socket.io server
  const io = new Server(socket.server, {
    path: "/api/video/socket", // Specify the path for socket connection
  });

  // Attach the io server to socket.server for future requests
  socket.server.io = io;

  // Listen for incoming socket connections
  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Handle joining a room
    socket.on("join", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      // Notify others in the room that a new user has joined
      socket.to(roomId).emit("user-joined");

      // Listen for the 'signal' event (WebRTC signaling messages)
      socket.on("webrtc-signal", (data) => {
        // Broadcast signal to all clients in the room (including the sender)
        io.to(roomId).emit("webrtc-signal", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} left room: ${roomId}`);
        socket.to(roomId).emit("user-left");
      });
    });
  });

  res.end();
}
