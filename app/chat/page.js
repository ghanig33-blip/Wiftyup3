'use client';

import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase'; // Ensure correct path to firebase config
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Real-time listener for Firestore messages
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: inputText,
        createdAt: serverTimestamp(),
        user: 'User' // Temporary user placeholder
      });
      setInputText('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <header className="py-4 border-b border-gray-800 text-center text-xl font-bold">
        WiftyUp Live Chat
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-gray-800 p-3 rounded-lg max-w-xs text-sm">
              <p className="text-gray-200">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-gray-800">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
