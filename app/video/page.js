'use client';

import { useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export default function DirectVideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [status, setStatus] = useState('Idle');
  const [inCall, setInCall] = useState(false);

  const APP_ID = 'a2eab83e53e1461f881ede90...'; // Apni Agora App ID yahan rakhein
  const CHANNEL = 'wiftyup-room';

  const rtcClient = useRef(null);

  const startCallDirect = async () => {
    setStatus('Camera & Mic Access Requesting...');
    try {
      // 1. Backend API se Token fetch karein
      const res = await fetch(`/api/agora-token?channelName=${CHANNEL}`);
      const data = await res.json();

      if (!data.token) {
        setStatus('Error: Token generation failed');
        return;
      }

      // 2. Agora RTC Client banayein
      rtcClient.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Remote User Event Handlers
      rtcClient.current.on('user-published', async (user, mediaType) => {
        await rtcClient.current.subscribe(user, mediaType);

        if (mediaType === 'video') {
          user.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      // Remote User Disconnect handling
      rtcClient.current.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video' && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = '';
        }
      });

      // 3. Channel Join karein
      await rtcClient.current.join(APP_ID, CHANNEL, data.token, null);

      // 4. Camera aur Mic tracks create aur publish karein
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      videoTrack.play(localVideoRef.current);
      await rtcClient.current.publish([audioTrack, videoTrack]);

      setInCall(true);
      setStatus('Call Connected!');
    } catch (err) {
      console.error(err);
      setStatus('Call Failed: ' + err.message);
    }
  };

  const endCall = async () => {
    if (rtcClient.current) {
      await rtcClient.current.leave();
    }
    setInCall(false);
    setStatus('Call Ended');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Agora Direct Video Call</h2>
      <p><strong>Status:</strong> {status}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
        {/* Local Video Stream */}
        <div>
          <h3>Local Video</h3>
          <div
            ref={localVideoRef}
            style={{ width: '320px', height: '240px', background: '#222', borderRadius: '8px' }}
          ></div>
        </div>

        {/* Remote Video Stream */}
        <div>
          <h3>Remote Video</h3>
          <div
            ref={remoteVideoRef}
            style={{ width: '320px', height: '240px', background: '#222', borderRadius: '8px' }}
          ></div>
        </div>
      </div>

      {!inCall ?
