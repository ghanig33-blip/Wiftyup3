'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase-browser';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Login successful! Redirecting...');
        window.location.href = '/dashboard';
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created! Please check your email or log in.');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleAuth} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0c', color: '#fff', fontFamily: 'sans-serif' },
  card: { background: '#141418', padding: '30px', borderRadius: '16px', border: '1px solid #23232a', width: '100%', maxWidth: '380px' },
  title: { fontSize: '24px', marginBottom: '20px', textAlign: 'center' },
  message: { background: '#222', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '15px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#000', color: '#fff', outline: 'none' },
  button: { padding: '12px', borderRadius: '8px', border: 'none', background: '#0070f3', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  toggleText: { marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#888' },
  link: { color: '#0070f3', cursor: 'pointer', fontWeight: 'bold' },
};

