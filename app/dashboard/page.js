'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-browser';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: '10px' }}>Dashboard 🎉</h1>
        <p style={styles.email}>Logged in as: <b>{user?.email}</b></p>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0c', color: '#fff', fontFamily: 'sans-serif' },
  center: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0c', color: '#fff' },
  card: { background: '#141418', padding: '40px', borderRadius: '16px', border: '1px solid #23232a', textAlign: 'center' },
  email: { color: '#aaa', margin: '15px 0 25px 0' },
  logoutBtn: { padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#ff4d4f', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
};
