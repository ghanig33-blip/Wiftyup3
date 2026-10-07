'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

  // Chat Lock State
  const [isLocked, setIsLocked] = useState(false);
  const [lockPin, setLockPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
      } else {
        router.push('/');
      }
    });

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

    const senderName = currentUser?.displayName || currentUser?.email || 'User';

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleSetLock = () => {
    if (lockPin.length === 4) {
      setIsLocked(true);
      setIsUnlocked(false);
      alert('Chat Locked with PIN!');
    } else {
      alert('Please enter a 4-digit PIN');
    }
  };

  const handleUnlock = () => {
    if (enteredPin === lockPin) {
      setIsUnlocked(true);
      setEnteredPin('');
    } else {
      alert('Incorrect PIN!');
    }
  };

  const startVideoCall = () => {
    alert('Initiating Global WebRTC Video Call... (Connecting peer-to-peer server)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-gray-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  // Locked Screen
  if (isLocked && !isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-xs w-full text-center space-y-4">
          <h2 className="text-xl font-bold">🔒 Chat Locked</h2>
          <p className="text-xs text-gray-400">Enter 4-digit PIN to access messages</p>
          <input
            type="password"
            maxLength={4}
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="••••"
            className="w-full text-center text-2xl tracking-widest bg-gray-700 text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUnlock}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      {/* WhatsApp Header */}
      <header className="py-3 border-b border-gray-800 flex justify-between items-center px-2 sm:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-blue-500">WiftyUp</h1>
          <span className="text-xs font-normal text-gray-400 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700 hidden sm:inline">
            {currentUser?.displayName || currentUser?.email}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Video Call Icon */}
          <button 
            onClick={startVideoCall}
            title="Start Video Call"
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-green-400 border border-gray-700 transition"
          >
            📹
          </button>

          {/* Lock Chat Icon / Controls */}
          {!isLocked ? (
            <div className="flex items-center gap-1">
              <input
                type="password"
                maxLength={4}
                value={lockPin}
                onChange={(e) => setLockPin(e.target.value)}
                placeholder="PIN"
                className="w-14 bg-gray-800 text-center text-xs py-1.5 rounded border border-gray-700 focus:outline-none"
              />
              <button
                onClick={handleSetLock}
                title="Lock Chat"
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs rounded border border-gray-700 text-yellow-400"
              >
                🔒 Lock
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-2.5 py-1.5 bg-yellow-600/20 text-yellow-400 text-xs rounded border border-yellow-500/30"
            >
              🔒 Lock Now
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-600/40 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No messages yet. Say hi!</p>
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

      {/* Input Field */}
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
