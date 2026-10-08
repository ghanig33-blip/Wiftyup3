"use client";

import { useState, useEffect } from "react";

// Hardcoded App ID to fix 'invalid vendor key / can not find appid' issue
const AGORA_APP_ID = "aabd642a418047589e5364b1f517daa1";

export default function Home() {
  const [joined, setJoined] = useState(false);
  const [channelName, setChannelName] = useState("main-room");
  const [rtc, setRtc] = useState({ client: null, localAudioTrack: null });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (rtc.client) {
        rtc.client.leave();
      }
    };
  }, [rtc.client]);

  const joinCall = async () => {
    try {
      setErrorMsg("");
      
      // Dynamic import to avoid SSR window/document undefined issues
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

      // Initialize RTC Client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      // Event Listeners for Remote Users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user) => {
        console.log("User left:", user.uid);
      });

      // Join Channel (Token is set to null for testing / Testing Mode)
      await client.join(AGORA_APP_ID, channelName, null, null);

      // Create Local Audio Track
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([localAudioTrack]);

      setRtc({ client, localAudioTrack });
      setJoined(true);
    } catch (err) {
      console.error("Agora Join Error:", err);
      setErrorMsg(err.message || "Failed to join call. Check console/App ID.");
    }
  };

  const leaveCall = async () => {
    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }
    if (rtc.client) {
      await rtc.client.leave();
    }
    setJoined(false);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.heading}>Wifty Free Call</h1>

      {errorMsg && (
        <div style={styles.errorBox}>
          <strong>AgoraRTCError:</strong>
          <p>{errorMsg}</p>
        </div>
      )}

      {!joined ? (
        <div style={styles.card}>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter Channel Name"
            style={styles.input}
          />
          <button onClick={joinCall} style={styles.joinBtn}>
            Join Call
          </button>
        </div>
      ) : (
        <div style={styles.card}>
          <p style={styles.status}>Connected to: <strong>{channelName}</strong></p>
          <button onClick={leaveCall} style={styles.leaveBtn}>
            Leave Call
          </button>
        </div>
      )}
    </main>
  );
}

// Basic inline styling
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#080808",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    maxWidth: "320px",
  },
  input: {
