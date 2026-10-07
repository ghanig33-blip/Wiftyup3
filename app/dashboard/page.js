'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {user ? (
          <div>
            <p className="text-gray-300 mb-6">Logged in as: <br /><span className="font-semibold text-blue-400">{user.phoneNumber || user.email || 'User'}</span></p>
            <div className="space-y-3">
              <a 
                href="/chat" 
                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Go to Chat
              </a>
              <button 
                onClick={handleLogout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Loading user session...</p>
        )}
      </div>
    </div>
  );
}
