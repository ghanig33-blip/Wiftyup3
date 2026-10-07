'use client';

import { useEffect, useRef, useState } from 'react';

export default function DirectVideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [status, setStatus] = useState('Idle');
  const [inCall, setInCall] = useState(false);

  const APP_ID = 'fe1f95d122e24d269877eb372e915fa8';
  const CHANNEL = 'wiftyup-room';

  const startCallDirect = async () => {
    setStatus('Requesting Media Permissions...');
    try {
      // Direct raw media stream trigger (bypass Next.js hydration lock)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStatus('Camera Granted! Loading Calling Engine...');

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }

      // Load Agora SDK dynamically strictly post permission grant
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video' && remoteVideoRef.current) {
          user.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      await client.join(APP_ID, CHANNEL, null, null);

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      const customVideoTrack = AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoTrack });
      const customAudioTrack = AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioTrack });

      await client.publish([customVideoTrack, customAudioTrack]);

      setInCall(true);
      setStatus('Connected & Streaming Live');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message || 'Permission Blocked by OS'}`);
      alert(`Camera/Mic Trigger Failed: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>WiftyUp Direct Media Call</h2>
      <p style={{ fontSize: '12px', color: '#a0aec0' }}>Status: {status}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', width: '100%', maxWidth: '500px', margin: '20px 0' }}>
        <div style={{ background: '#1a202c', borderRadius: '12px', height: '220px', overflow: 'hidden', position: 'relative' }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>You (Local)</span>
        </div>

        <div style={{ background: '#1a202c', borderRadius: '12px', height: '220px', overflow: 'hidden', position: 'relative' }}>
          <div ref={remoteVideoRef} style={{ width: '100%', height: '100%' }} />
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>Remote User</span>
        </div>
      </div>

      {!inCall ? (
        <button onClick={startCallDirect} style={{ background: '#22c55e', color: '#fff', padding: '14px 28px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          📹 Start Direct Call
        </button>
      ) : (
        <button onClick={() => window.location.reload()} style={{ background: '#ef4444', color: '#fff', padding: '14px 28px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          🚫 End Call
        </button>
      )}
    </div>
  );
}
