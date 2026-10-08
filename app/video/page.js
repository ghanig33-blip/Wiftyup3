import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

// --- CONFIGURATION ---
const APP_ID = "A2eab83e53e1461f881ede90e5ce48ca"; // Aapki App ID
const CHANNEL_NAME = "WiftyFreeCall"; // Project / Channel Name

// Testing Mode ke liye NULL rakha gaya hai (agar Temp Token use karna ho toh string yahan dein)
const TOKEN = null; 

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export default function VideoCallApp() {
  const [joined, setJoined] = useState(false);
  const [localTracks, setLocalTracks] = useState({ videoTrack: null, audioTrack: null });
  const [errorMsg, setErrorMsg] = useState("");

  const startCall = async () => {
    try {
      setErrorMsg("");
      
      // 1. Channel join karein
      const uid = await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);

      // 2. Camera aur Microphone setup karein
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks({ audioTrack, videoTrack });

      // 3. Local Video Preview dikhaein
      videoTrack.play('local-player');

      // 4. Video/Audio publish karein
      await client.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Agora Call Error:", err);
      setErrorMsg(err.message || "Failed to start call");
    }
  };

  const leaveCall = async () => {
    // Tracks close karein
    if (localTracks.audioTrack) localTracks.audioTrack.close();
    if (localTracks.videoTrack) localTracks.videoTrack.close();

    // Channel leave karein
    await client.leave();
    setJoined(false);
  };

  // Remote Users ko handle karne ke liye listeners
  useEffect(() => {
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        user.videoTrack.play('remote-player');
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
    });

    client.on('user-unpublished', (user) => {
      // Remote user cleanup
    });

    return () => {
      client.removeAllListeners();
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2>WiftyUp HD Video Call</h2>

      {errorMsg && (
        <div style={{ color: '#ff4d4d', backgroundColor: '#330000', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
        {/* Local Video Container */}
        <div>
          <h3>You (Local)</h3>
          <div id="local-player" style={{ width: '300px', height: '225px', backgroundColor: '#222', borderRadius: '10px', overflow: 'hidden' }}></div>
        </div>

        {/* Remote Video Container */}
        <div>
          <h3>Remote Peer</h3>
          <div id="remote-player" style={{ width: '300px', height: '225px', backgroundColor: '#222', borderRadius: '10px', overflow: 'hidden' }}></div>
        </div>
      </div>

      <div>
        {!joined ? (
          <button 
            onClick={startCall} 
            style={{ padding: '12px 30px', fontSize: '16px', backgroundColor: '#00c853', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>
            📹 Start Call
          </button>
        ) : (
          <button 
            onClick={leaveCall} 
            style={{ padding: '12px 30px', fontSize: '16px', backgroundColor: '#d50000', color: '#fff', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>
            🛑 End Call
          </button>
        )}
      </div>
    </div>
  );
}
