'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Apne firebase config ka path check kar lein

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    // Check karein ke user logged in hai ya nahi
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Agar user login nahi hai toh login page par waapas bhej dein
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-4 text-blue-400">Welcome to WiftyUp Dashboard!</h1>
        
        <div className="space-y-3 border-t border-b border-gray-700 py-4 my-4">
          <p className="text-gray-300">
            <strong className="text-white">Logged in Identifier:</strong>{' '}
            {user?.email || user?.phoneNumber || 'Anonymous User'}
          </p>
          <p className="text-gray-300">
            <strong className="text-white">User ID (UID):</strong> {user?.uid}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium transition"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
