'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { app } from '@/lib/firebase'; // Ya jo bhi aapka firebase config path hai

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [auth]);

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setStatus('Google Sign-In Successful!');
      router.push('/dashboard');
    } catch (error) {
      setStatus(`Google Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Send OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setStatus('Sending OTP...');
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStatus('OTP Sent successfully! Check your phone.');
    } catch (error) {
      setStatus(`Phone Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setStatus('Verifying OTP...');
      await confirmationResult.confirm(otp);
      setStatus('Phone Auth Successful!');
      router.push('/dashboard');
    } catch (error) {
      setStatus(`OTP Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-md mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">WiftyUp Auth Testing</h1>

      {status && (
        <div className="p-3 bg-gray-800 text-white rounded text-sm break-words">
          <strong>Status:</strong> {status}
        </div>
      )}

      {/* Recaptcha Container */}
      <div id="recaptcha-container"></div>

      {/* Google Auth */}
      <section className="border-t pt-4">
        <h2 className="font-semibold mb-2">1. Google Auth</h2>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="bg-white text-black px-4 py-2 rounded font-medium border"
        >
          Sign in with Google
        </button>
      </section>

      {/* Phone Auth */}
      <section className="border-t pt-4 flex flex-col gap-3">
        <h2 className="font-semibold">2. Phone Auth</h2>
        
        {!confirmationResult ? (
          <>
            <input
              type="text"
              placeholder="+923001234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="p-2 border rounded text-black"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 border rounded text-black"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded font-medium"
            >
              Verify OTP
            </button>
          </>
        )}
      </section>
    </main>
  );
}
