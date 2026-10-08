'use client';

import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

// --- CONFIGURATION ---
const APP_ID = "A2eab83e53e1461f881ede90e5ce48ca";
const TOKEN = "007eJxTYBCV+HlYwei5S+qqO+7J4m9V3eTFbm85YGApu6IiTedfkq4CQ6JRamKShXGqqXGqoYmZYZqFhWFqSqqlQappcqqJRXKiiN/xrIZARgYGU2UWRgYIBPH5GMoz00oqSwsUdIvy83MNGRgA3n0gQA==";
const CHANNEL_NAME = "WiftyFreeCall";

// RTC Client Initialization
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCallPage() {
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
  const [errorMsg, setErrorMsg] = useState("");

  const startCall = async () => {
    try {
      setErrorMsg("");

      // 1. Join the channel
      await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);

      // 2. Create microphone and camera tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks({ audioTrack, videoTrack });

      // 3. Play local video track
      videoTrack.play('local-player');

      // 4. Publish tracks to channel
      await client.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Agora Error:", err);
      setErrorMsg(err.message || "Failed to start video call");
    }
  };

  const leaveCall = async () => {
    // Stop and close tracks
    if (localTracks.audioTrack) {
      localTracks.audioTrack.stop();
      localTracks.audioTrack.close();
    }
    if (localTracks.videoTrack) {
      localTracks.videoTrack.stop();
      localTracks.videoTrack.close();
    }

    // Leave channel
    await client.leave();
    setJoined(false);
  };

  useEffect(() => {
    // Handle remote users joining/publishing
    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        user.videoTrack.play('remote-player');
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    };

    const handleUserUnpublished = (user) => {
      // Clean up remote user video container if needed
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#0f172a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>WiftyUp HD Video Call</h2>

      {errorMsg && (
        <div style={{ color: '#ff4d4d', backgroundColor: '#330000', padding: '12px', borderRadius: '8px', maxWidth: '500px', margin: '0 auto 20px auto', fontSize: '14px' }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
        {/* Local Player */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>You (Local)</h3>
          <div id="local-player" style={{ width: '320px', height: '240px', backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}></div>
        </div>

        {/* Remote Player */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Remote Peer</h3>
          <div id="remote-player" style={{ width: '320px', height: '240px', backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden' }}></div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {!joined ? (
          <button 
            onClick={startCall} 
            style={{ padding: '12px 32px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
            📹 Start Call
          </button>
        ) : (
          <button 
            onClick={leaveCall} 
            style={{ padding: '12px 32px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>
            🛑 End Call
          </button>
        )}
      </div>
    </div>
  );
}
