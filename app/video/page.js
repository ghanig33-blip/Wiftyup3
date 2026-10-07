'use client';

import { useRef, useState } from 'react';

export default function DirectVideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [status, setStatus] = useState('Idle');
  const [inCall, setInCall] = useState(false);

  const APP_ID = '69e3edbbb2364bd495222e330004af2d'; 
  const CHANNEL = 'wiftyup-room';
  
  // Updated Valid Temp Token
  const TEMP_TOKEN = '007eJxTYHgT93vnqhXZfsnRlxi+Gwuu4zb/K6DDMeMM07W17FpZuw0UGMwsU41TU5KSkoyMzUySUkwsTY2MjFKNjQ0MDEwS04xS9s07ltUQyMjQXPychZEBAkF8XobyjMy0ksrSAt2i/PxcBgYAVqsi8A=='; 

  const startCallDirect = async () => {
    setStatus('Camera & Mic Access Requesting...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStatus('Camera Granted! Connecting to Agora Server...');

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();
      }

      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      AgoraRTC.setLogLevel(3);
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

      // Joining with valid Token
      await client.join(APP_ID.trim(), CHANNEL, TEMP_TOKEN, null);

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      const tracksToPublish = [];
      if (videoTrack) tracksToPublish.push(AgoraRTC.createCustomVideoTrack({ mediaStreamTrack: videoTrack }));
      if (audioTrack) tracksToPublish.push(AgoraRTC.createCustomAudioTrack({ mediaStreamTrack: audioTrack }));

      if (tracksToPublish.length > 0) {
        await client.publish(tracksToPublish);
      }

      setInCall(true);
      setStatus('Connected & Streaming Live!');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
      alert(`Call Connection Failed: ${err.message}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ margin: '10px 0' }}>WiftyUp HD Video Call</h2>
      <p style={{ fontSize: '13px', color: '#a0aec0', marginBottom: '20px' }}>Status: {status}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', width: '100%', maxWidth: '500px', margin: '10px 0' }}>
        <div style={{ background: '#1a202c', borderRadius: '12px', height: '220px', overflow: 'hidden', position: 'relative' }}>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>You (Local)</span>
        </div>

        <div style={{ background: '#1a202c', borderRadius: '12px', height: '220px', overflow: 'hidden', position: 'relative' }}>
          <div ref={remoteVideoRef} style={{ width: '100%', height: '100%' }} />
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>Remote Peer</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {!inCall ? (
          <button onClick={startCallDirect} style={{ background: '#22c55e', color: '#fff', padding: '14px 32px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            📹 Start Call
          </button>
        ) : (
          <button onClick={() => window.location.reload()} style={{ background: '#ef4444', color: '#fff', padding: '14px 32px', borderRadius: '30px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            🚫 End Call
          </button>
        )}
      </div>
    </div>
  );
}
