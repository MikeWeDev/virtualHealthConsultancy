'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  content?: string;
  file?: {
    name: string;
    type: string;
    data: string;
  };
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [mySocketId, setMySocketId] = useState<string>('');
  const roomId = 'some-room-id';

  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      path: '/api/socket.js',
      autoConnect: true,
      reconnection: true,
    });

    socketInstance.on('connect', () => {
      console.log('Connected:', socketInstance.id);
      setMySocketId(socketInstance.id ?? '');
      socketInstance.emit('join', roomId);
    });

    socketInstance.on('signal', (incomingMessage: Message) => {
      console.log('Received message:', incomingMessage);
      setMessages(prevMessages => {
        // Check if message already exists (by ID)
        if (prevMessages.some(msg => msg.id === incomingMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, incomingMessage];
      });
    });

    socketInstance.on('user-joined', (userId: string) => {
      console.log(`User joined: ${userId}`);
    });

    socketInstance.on('user-left', (userId: string) => {
      console.log(`User left: ${userId}`);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      const messageToSend: Message = {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        senderId: socket.id,
        content: newMessage,
      };

      // Add message immediately to UI (optimistic update)
      setMessages(prev => [...prev, messageToSend]);
      setNewMessage('');

      // Send to server
      socket.emit('signal', { ...messageToSend, roomId });
    }
  };

  const handleSendFile = () => {
    if (!file || !socket) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileMessage: Message = {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        senderId: socket.id,
        file: {
          name: file.name,
          type: file.type,
          data: reader.result as string,
        },
      };

      // Add file message immediately to UI
      setMessages(prev => [...prev, fileMessage]);
      setFile(null);

      // Send to server with roomId
      socket.emit('signal', { ...fileMessage, roomId });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-0 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px]">
      {/* Top Navbar */}
      <div className="flex items-center gap-4 p-4 border-b bg-blue-500 text-white rounded-t-lg">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Doctor Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold">Dr. John Smith</span>
          <span className="text-sm text-green-200">Online</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === mySocketId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`group relative max-w-xs p-3 rounded-lg text-sm shadow ${
                msg.senderId === mySocketId
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}
            >
              {msg.senderId !== mySocketId && (
                <div className="text-xs font-semibold mb-1">
                  {msg.senderId === socket?.id ? 'You' : `User ${msg.senderId.slice(0, 4)}`}
                </div>
              )}
              
              {msg.content && <p className="break-words">{msg.content}</p>}

              {msg.file && (
                <div className="flex flex-col gap-1 mt-2">
                  {msg.file.type.startsWith('image') ? (
                    <img
                      src={msg.file.data}
                      alt={msg.file.name}
                      className="max-w-[160px] max-h-[160px] object-cover rounded-md"
                    />
                  ) : (
                    <a
                      href={msg.file.data}
                      download={msg.file.name}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Download {msg.file.name}
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 hidden group-hover:flex items-center justify-center shadow-md hover:bg-red-600 transition"
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t bg-white flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          {file && (
            <div className="flex items-center gap-2">
              <span className="text-sm truncate max-w-[100px]">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
          <button
            onClick={handleSendFile}
            disabled={!file}
            className={`px-6 py-2 rounded-full text-white transition ${
              file ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;