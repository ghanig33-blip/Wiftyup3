'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth state listener with route protection
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        // Agar user login nahi hai, login page par redirect kar do
        router.push('/');
      }
    });

    // Real-time messages listener
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribeChat = onSnapshot(q, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeChat();
    };
  }, [router]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderName = currentUser?.phoneNumber || currentUser?.email || 'User';

    try {
      await addDoc(collection(db, 'messages'), {
        text: inputText,
        createdAt: serverTimestamp(),
        sender: senderName,
        userId: currentUser?.uid || null
      });
      setInputText('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-gray-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <header className="py-4 border-b border-gray-800 text-center text-xl font-bold flex justify-between items-center px-4">
        <span>WiftyUp Live Chat</span>
        <span className="text-xs font-normal text-blue-400 bg-gray-800 px-3 py-1 rounded-full">
          {currentUser?.phoneNumber || currentUser?.email || 'Logged In'}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUser?.uid;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs text-gray-400 mb-1 px-1">
                  {msg.sender || 'User'}
                </span>
                <div 
                  className={`p-3 rounded-lg max-w-xs text-sm ${
                    isMe ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

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
