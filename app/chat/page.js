'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sana', text: 'Hey! Welcome to WiftyUp 👋', time: '2m ago' },
    { id: 2, sender: 'Tech Vision', text: 'Check out the new community.', time: '18m ago' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'Me', text: input, time: 'Just now' }
    ]);
    setInput('');
  };

  const startCall = (type) => {
    alert(`Initiating End-to-End Encrypted ${type} Call worldwide...`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20 flex flex-col">
      {/* Top Header */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white font-bold text-lg">
            ←
          </Link>
          <div>
            <h2 className="font-bold text-lg">Global Chat</h2>
            <span className="text-xs text-green-400">● Encrypted & Active</span>
          </div>
        </div>

        {/* Action Buttons for Audio & Video Call */}
        <div className="flex gap-2">
          <button 
            onClick={() => startCall('Audio')} 
            className="px-3 py-1.5 bg-purple-900/50 hover:bg-purple-800 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-300"
          >
            📞 Voice Call
          </button>
          <button 
            onClick={() => startCall('Video')} 
            className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-300"
          >
            📹 Video Call
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-gray-400 mb-1 px-1">
              {msg.sender} • {msg.time}
            </span>
            <div 
              className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                msg.sender === 'Me' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button 
          onClick={handleSend} 
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

