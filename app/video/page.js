'use client';

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = 'A2eab83e53e1461f881ede90e5ce48ca';
const TOKEN =
  '007eJxTYBCV+HlYwei5S+qqO+7J4m9V3eTFbm85YGApu6IiTedfkq4CQ6JRamKShXGqqXGqoYmZYZqFhWFqSqqlQappcqqJRXKiiN/xrIZARgYGU2UWRgYIBPH5GMoz00oqSwsUdIvy83MNGRgA3n0gQA==';

const CHANNEL_NAME = 'WiftyFreeCall';

export default function VideoPage() {
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, []);

  const joinCall = async () => {
    try {
      setStatus('Connecting...');

      const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8',
      });

      clientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;

          if (remoteVideoTrack && remoteVideoRef.current) {
            remoteVideoTrack.play(remoteVideoRef.current);
          }
        }

        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video' && remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = '';
        }
      });

      client.on('user-left', () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = '';
        }
      });

      const uid = await client.join(
        APP_ID,
        CHANNEL_NAME,
        TOKEN,
        null
      );

      const microphoneTrack =
        await AgoraRTC.createMicrophoneAudioTrack();

      const cameraTrack =
        await AgoraRTC.createCameraVideoTrack();

      localTracksRef.current = [
        microphoneTrack,
        cameraTrack,
      ];

      await client.publish([
        microphoneTrack,
        cameraTrack,
      ]);

      if (localVideoRef.current) {
        cameraTrack.play(localVideoRef.current);
      }

      setJoined(true);
      setStatus(`Connected • UID: ${uid}`);
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const leaveCall = async () => {
    try {
      localTracksRef.current.forEach((track) => {
        track.stop();
        track.close();
      });

      localTracksRef.current = [];

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }

      setJoined(false);
      setStatus('Call ended');
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMic = async () => {
    const microphoneTrack = localTracksRef.current[0];

    if (!microphoneTrack) return;

    const newState = !micOn;

    await microphoneTrack.setEnabled(newState);
    setMicOn(newState);
  };

  const toggleCamera = async () => {
    const cameraTrack = localTracksRef.current[1];

    if (!cameraTrack) return;

    const newState = !cameraOn;

    await cameraTrack.setEnabled(newState);
    setCameraOn(newState);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#fff',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>
        WiftyUp Video Call
      </h1>

      <p style={{ textAlign: 'center', color: '#aaa' }}>
        {status}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px',
          maxWidth: '900px',
          margin: '25px auto',
        }}
      >
        <div
          ref={localVideoRef}
          style={{
            height: '300px',
            background: '#222',
            borderRadius: '15px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {!joined && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#777',
              }}
            >
              Your Camera
            </div>
          )}
        </div>

        <div
          ref={remoteVideoRef}
          style={{
            height: '300px',
            background: '#222',
            borderRadius: '15px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#777',
          }}
        >
          Remote User
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        {!joined ? (
          <button
            onClick={joinCall}
            style={{
              padding: '14px 25px',
              border: 'none',
              borderRadius: '10px',
              background: '#2196f3',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Join Call
          </button>
        ) : (
          <>
            <button
              onClick={toggleMic}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '10px',
                background: micOn ? '#333' : '#d32f2f',
                color: '#fff',
                fontSize: '15px',
              }}
            >
              {micOn ? '🎤 Mic On' : '🔇 Mic Off'}
            </button>

            <button
              onClick={toggleCamera}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '10px',
                background: cameraOn ? '#333' : '#d32f2f',
                color: '#fff',
                fontSize: '15px',
              }}
            >
              {cameraOn ? '📷 Camera On' : '📵 Camera Off'}
            </button>

            <button
              onClick={leaveCall}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderRadius: '10px',
                background: '#f44336',
                color: '#fff',
                fontSize: '15px',
              }}
            >
              End Call
            </button>
          </>
        )}
      </div>
    </main>
  );
}
