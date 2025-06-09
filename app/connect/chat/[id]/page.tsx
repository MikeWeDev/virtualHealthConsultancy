'use client';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string;
  content?: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const socket = useRef<Socket | null>(null);
  const [mySocketId, setMySocketId] = useState('');
  const roomId = 'some-room-id'; // Replace if needed
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socketInstance = io('https://virtual-health-one.vercel.app', {
      path: '/api/socket',
    });

    socket.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log('✅ Connected with ID:', socketInstance.id);
      setMySocketId(socketInstance.id ?? '');
      socketInstance.emit('join', roomId);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
    });

    socketInstance.on('signal', (incomingMessage: Message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === incomingMessage.id)) return prevMessages;
        return [...prevMessages, incomingMessage];
      });
    });

    socketInstance.on('user-joined', () => {
      console.log('👤 A new user joined');
    });

    socketInstance.on('user-left', () => {
      console.log('🚪 A user left');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket.current && socket.current.connected) {
      const messageToSend: Message = {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        senderId: mySocketId,
        content: newMessage.trim(),
      };

      setMessages((prev) => [...prev, messageToSend]);

      socket.current.emit('signal', messageToSend);
      setNewMessage('');
    } else {
      console.warn('⚠️ Socket not connected or message is empty');
    }
  };

  const handleSendFile = () => {
    if (!file || !socket.current || !socket.current.connected) return;

    const fileUrl = URL.createObjectURL(file);

    const fileMessage: Message = {
      id: `${Date.now()}-${performance.now().toString().replace('.', '')}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: mySocketId,
      file: {
        name: file.name,
        url: fileUrl,
        type: file.type,
      },
    };

    setMessages((prev) => [...prev, fileMessage]);

    socket.current.emit('signal', fileMessage);
    setFile(null);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-0 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px]">
      {/* Top Navbar */}
      <div className="flex items-center gap-4 p-4 border-b bg-green-500 text-white rounded-t-lg">
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
            className={`flex ${msg.senderId === mySocketId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`group relative max-w-xs p-3 rounded-lg text-sm shadow break-words
                ${
                  msg.senderId === mySocketId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-black rounded-bl-none'
                }`}
              style={{ wordBreak: 'break-word' }}
            >
              {msg.content && <p>{msg.content}</p>}

              {msg.file && (
                <div className="flex flex-col gap-1 mt-2">
                  {msg.file.type.startsWith('image') ? (
                    <img
                      src={msg.file.url}
                      alt={msg.file.name}
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{msg.file.name}</span>
                      <span className="text-xs text-gray-500">{msg.file.type}</span>
                    </div>
                  )}
                  <a
                    href={msg.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-sm text-blue-500"
                  >
                    Open file
                  </a>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 hidden group-hover:flex items-center justify-center shadow-md"
                title="Delete"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            type="button"
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
          <button
            onClick={handleSendFile}
            disabled={!file}
            className={`px-6 py-2 rounded-full text-white transition ${
              file ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
            }`}
            type="button"
          >
            Send File
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
