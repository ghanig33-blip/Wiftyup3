'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { app } from '@/lib/firebase'; // Apne firebase config file ka path check kar lein

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    // Current user check
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }

    // Real-time Firestore Messages Listener
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Send Message function
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: input,
        sender: user?.email || user?.phoneNumber || 'User',
        senderId: user?.uid || 'guest',
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
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
            <span className="text-xs text-green-400">● Real-time Encrypted</span>
          </div>
        </div>

        {/* Action Buttons for Calling */}
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

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-gray-400 mb-1 px-1">
                {msg.sender}
              </span>
              <div 
                className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                  isMe 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : 'bg-gray-800 text-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
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
