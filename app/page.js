'use client';

import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier 
} from 'firebase/auth';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log("Recaptcha verified");
        }
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setMessage('OTP sent successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Error sending OTP: ' + error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!confirmationResult) return;

    try {
      await confirmationResult.confirm(otp);
      setMessage('Phone number verified successfully!');
      window.location.href = '/chat';
    } catch (error) {
      console.error(error);
      setMessage('Invalid OTP: ' + error.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <div id="recaptcha-container"></div>
      
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">WiftyUp Login</h1>

        {message && (
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded text-sm text-center">
            {message}
          </div>
        )}

        {!confirmationResult ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+923001234567"
                required
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-semibold transition"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
