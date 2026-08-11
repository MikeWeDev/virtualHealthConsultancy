'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import {
  FiPaperclip,
  FiSend,
  FiX,
  FiFile,
  FiCheck,
} from 'react-icons/fi';
import { useUser } from '../../../context/UserContext';
import doctorData from '../../../doctor/ProductPage';

interface Message {
  id: string;
  senderId: string;
  content?: string;
  timestamp?: string;
  file?: {
    name: string;
    type: string;
    data: string;
  };
}

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://virtua-health-consultancy-server.onrender.com'
).replace(/\/$/, '');

const ChatWindow = () => {
  const { id } = useParams() as { id?: string };
  const roomId = id ?? 'default-chat-room';

  const { user } = useUser();

  // Retrieve predefined Doctor details
  const doctor = useMemo(() => {
    if (!user?.doctorId) return null;
    return doctorData.find((item) => String(item.id) === String(user.doctorId)) || null;
  }, [user]);

  // Doctor Name and Initial for Header & Incoming Messages
  const rawDoctorName = doctor?.Name || '';
  const doctorName = rawDoctorName.startsWith('Dr.') ? rawDoctorName : `Dr. ${rawDoctorName}`;
  const doctorInitial = doctorName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase() || 'D';

  // Patient Info for Outgoing Messages
  const patientName = user?.name || 'Guest Patient';
  const patientInitial = patientName.charAt(0).toUpperCase() || 'P';

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mySocketId, setMySocketId] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socketInstance: Socket = io(BACKEND_URL, {
      path: '/api/socket',
      withCredentials: true,
      transports: ['polling', 'websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 60000,
    });

    const handleConnect = () => {
      setMySocketId(socketInstance.id ?? '');
      socketInstance.emit('join', roomId);
    };

    const handleSignal = (incomingMessage: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incomingMessage.id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('signal', handleSignal);

    socketInstance.open();
    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('signal', handleSignal);
      socketInstance.emit('leave', roomId);
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if ((!newMessage.trim() && !file) || !socket) return;

    const timeString = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileMessage: Message = {
          id: `${Date.now()}-${crypto.randomUUID()}`,
          senderId: socket.id || mySocketId,
          timestamp: timeString,
          content: newMessage.trim() || undefined,
          file: {
            name: file.name,
            type: file.type,
            data: reader.result as string,
          },
        };

        setMessages((prev) => [...prev, fileMessage]);
        socket.emit('signal', { ...fileMessage, roomId });
        removeFile();
        setNewMessage('');
      };
      reader.readAsDataURL(file);
    } else {
      const messageToSend: Message = {
        id: `${Date.now()}-${crypto.randomUUID()}`,
        senderId: socket.id || mySocketId,
        content: newMessage.trim(),
        timestamp: timeString,
      };

      setMessages((prev) => [...prev, messageToSend]);
      socket.emit('signal', { ...messageToSend, roomId });
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[100dvh] md:h-[500px] bg-[#0e1621] md:rounded-xl shadow-2xl overflow-hidden border-0 md:border border-slate-800">
      
      {/* 1. Header: Always Predefined Doctor Info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#17212b] border-b border-slate-800 select-none flex-shrink-0">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-inner">
            {doctorInitial}
          </div>
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#17212b] ${
              socket?.connected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-white font-medium text-base truncate">
            {doctorName}
          </h2>
          <span className="text-xs text-slate-400">
            {socket?.connected ? 'online' : 'connecting...'}
          </span>
        </div>
      </div>

      {/* 2. Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0e1621]">
        {messages.map((msg) => {
          const isMe = msg.senderId === mySocketId;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`group relative max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow-md break-words ${
                  isMe
                    ? 'bg-[#2b5278] text-white rounded-br-xs'
                    : 'bg-[#182533] text-slate-100 rounded-bl-xs border border-slate-800'
                }`}
              >
                {/* Outgoing (Patient point of view) */}
                {isMe ? (
                  <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-sky-200 mb-1">
                    <span>{patientName}</span>
                    <span className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center text-[9px] font-bold">
                      {patientInitial}
                    </span>
                  </div>
                ) : (
                  /* Incoming (Doctor response) */
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 mb-1">
                    <span className="w-4 h-4 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center text-[9px] font-bold">
                      {doctorInitial}
                    </span>
                    <span>{doctorName}</span>
                  </div>
                )}

                {msg.file && (
                  <div className="mb-2">
                    {msg.file.type.startsWith('image/') ? (
                      <img
                        src={msg.file.data}
                        alt={msg.file.name}
                        className="rounded-lg max-h-60 w-full object-cover"
                      />
                    ) : (
                      <a
                        href={msg.file.data}
                        download={msg.file.name}
                        className="flex items-center gap-2 p-2 bg-black/20 rounded-lg hover:bg-black/30 transition text-sky-300"
                      >
                        <FiFile className="w-6 h-6 flex-shrink-0" />
                        <span className="text-xs truncate max-w-[180px]">
                          {msg.file.name}
                        </span>
                      </a>
                    )}
                  </div>
                )}

                {msg.content && <p className="leading-relaxed">{msg.content}</p>}

                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp || 'Just now'}</span>
                  {isMe && <FiCheck className="w-3 h-3 text-sky-300" />}
                </div>

                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Delete message"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Attachment Preview */}
      {file && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#17212b] border-t border-slate-800 text-xs text-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2 truncate">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview"
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <FiFile className="w-5 h-5 text-sky-400" />
            )}
            <span className="truncate max-w-[200px] font-medium">
              {file.name}
            </span>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Bottom Input */}
      <div className="p-2 sm:p-3 bg-[#17212b] border-t border-slate-800 flex items-center gap-2 flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-slate-400 hover:text-sky-400 rounded-full hover:bg-slate-800 transition flex-shrink-0"
          title="Attach file"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-[#0e1621] text-white placeholder-slate-500 text-sm rounded-full px-4 py-2.5 focus:outline-none border border-slate-800 focus:border-sky-500 transition"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!newMessage.trim() && !file}
          className={`p-2.5 rounded-full transition flex-shrink-0 ${
            newMessage.trim() || file
              ? 'bg-sky-500 text-white hover:bg-sky-400 cursor-pointer'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;