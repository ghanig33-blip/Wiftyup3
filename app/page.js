"use client";
import { useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [status, setStatus] = useState("");

  // 1. Google Sign-In Test
  const handleGoogleLogin = async () => {
    try {
      setStatus("Google login initiated...");
      const res = await signInWithPopup(auth, googleProvider);
      setStatus(`Success! Logged in as: ${res.user.displayName || res.user.email}`);
    } catch (err) {
      setStatus(`Google Error: ${err.message}`);
    }
  };

  // 2. Email Sign-Up Test
  const handleEmailSignUp = async () => {
    try {
      setStatus("Creating email account...");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setStatus(`Success! User created: ${res.user.email}`);
    } catch (err) {
      setStatus(`Email Error: ${err.message}`);
    }
  };

  // 3. Phone Auth Test (OTP)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const handleSendOtp = async () => {
    try {
      setStatus("Sending OTP...");
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStatus("OTP Sent! Enter the code below.");
    } catch (err) {
      setStatus(`Phone Error: ${err.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setStatus("Verifying OTP...");
      const res = await confirmationResult.confirm(otp);
      setStatus(`Success! Phone logged in: ${res.user.phoneNumber}`);
    } catch (err) {
      setStatus(`OTP Error: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1>WiftyUp Auth Testing</h1>
      
      {status && (
        <div style={{ padding: "10px", background: "#f0f0f0", marginBottom: "20px", borderRadius: "5px", wordBreak: "break-all" }}>
          <strong>Status:</strong> {status}
        </div>
      )}

      {/* Google Test */}
      <section style={{ marginBottom: "20px" }}>
        <h3>1. Google Auth</h3>
        <button onClick={handleGoogleLogin} style={{ padding: "10px 15px", cursor: "pointer" }}>
          Sign in with Google
        </button>
      </section>

      <hr />

      {/* Email Test */}
      <section style={{ marginBottom: "20px" }}>
        <h3>2. Email Auth</h3>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <button onClick={handleEmailSignUp} style={{ padding: "8px 12px" }}>Sign Up with Email</button>
      </section>

      <hr />

      {/* Phone Test */}
      <section style={{ marginBottom: "20px" }}>
        <h3>3. Phone Auth</h3>
        <input 
          type="tel" 
          placeholder="+923001234567" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
        />
        <button onClick={handleSendOtp} style={{ padding: "8px 12px", marginBottom: "10px" }}>Send OTP</button>

        {confirmationResult && (
          <div>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              style={{ display: "block", width: "100%", marginBottom: "8px", padding: "8px" }}
            />
            <button onClick={handleVerifyOtp} style={{ padding: "8px 12px" }}>Verify OTP</button>
          </div>
        )}
        <div id="recaptcha-container"></div>
      </section>
    </div>
  );
}
