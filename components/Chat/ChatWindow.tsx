// components/Chat/ChatWindow.tsx

import { useState, useEffect } from 'react';

interface Message {
  sender: 'doctor' | 'patient';
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // Simulate receiving a message from a doctor
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'doctor', content: 'Hello, how can I help you today?' },
      ]);
    }, 5000); // Simulate a new message from the doctor every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'patient', content: newMessage },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
      <div className="message-list space-y-4 mb-4 max-h-96 overflow-y-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg text-white ${
              msg.sender === 'doctor' ? 'bg-gray-400 text-left' : 'bg-green-500 text-right'
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-3 rounded-lg border border-gray-300"
        />
        <button
          onClick={handleSendMessage}
          className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
