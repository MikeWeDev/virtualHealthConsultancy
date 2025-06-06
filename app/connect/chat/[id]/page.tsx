'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Message {
  id: string;
  senderId: string; // used to determine if the message is yours or from someone else
  content?: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [mySocketId, setMySocketId] = useState<string>(''); // store our own socket id
  const roomId = 'some-room-id'; // adjust or make dynamic if needed

  useEffect(() => {
    const socketInstance = io('https://virtualhealthconsultancy-production.up.railway.app/', {
      path: '/api/socket',
    });

    // On connect, save your socket id and join the room
    socketInstance.on('connect', () => {
      console.log('Connected to socket server with id:', socketInstance.id);
      setMySocketId(socketInstance.id ?? '');
      socketInstance.emit('join', roomId);
    });

    // Listen for incoming messages (the server is echoing messages via 'signal')
    socketInstance.on('signal', (incomingMessage: Message) => {
      setMessages((prevMessages) => {
        // Prevent duplicate messages by checking senderId and id
        const exists = prevMessages.some((msg) => msg.id === incomingMessage.id);
        return exists ? prevMessages : [...prevMessages, incomingMessage];
      });
    });

    // Log join/leave events
    socketInstance.on('user-joined', () => {
      console.log('A new user joined');
    });
    socketInstance.on('user-left', () => {
      console.log('A user left');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      // Generate a strong unique ID (using Date.now, crypto.randomUUID for extra uniqueness)
      const messageToSend: Message = {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        senderId: socket.id, // mark this as your message
        content: newMessage,
      };

      // We only emit the message (and let our socket event add it via the received event)
      socket.emit('signal', messageToSend);
      setNewMessage('');
    }
  };

  const handleSendFile = () => {
    if (!file || !socket) return;

    const fileUrl = URL.createObjectURL(file);

    const fileMessage: Message = {
      id: `${Date.now()}-${performance.now().toString().replace('.', '')}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: socket.id,
      file: {
        name: file.name,
        url: fileUrl,
        type: file.type,
      },
    };

    setMessages((prevMessages) => {
      const exists = prevMessages.some((msg) => msg.id === fileMessage.id);
      return exists ? prevMessages : [...prevMessages, fileMessage];
    });

    socket.emit('signal', fileMessage);
    setFile(null);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
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
      <div className="flex-1 overflow-y-scroll p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id} /* now that id is consistent, we can use it as key */
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
