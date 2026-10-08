'use client';

import React, { useEffect, useRef, useState } from 'react';

const CHANNEL_NAME = 'WiftyFreeCall';

export default function VideoPage() {
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);
  const AgoraRTCRef = useRef(null);

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadAgora() {
      try {
        // IMPORTANT:
        // Agora ko browser ke andar hi load karna hai.
        // Isse "window is not defined" error nahi aayega.
        const AgoraModule = await import('agora-rtc-sdk-ng');

        if (!mounted) return;

        const AgoraRTC = AgoraModule.default;

        AgoraRTCRef.current = AgoraRTC;

        const client = AgoraRTC.createClient({
          mode: 'rtc',
          codec: 'vp8'
        });

        clientRef.current = client;

        client.on('user-published', async (user, mediaType) => {
          try {
            await client.subscribe(user, mediaType);

            if (!mounted) return;

            if (mediaType === 'video') {
              const player = document.getElementById(
                `remote-video-${user.uid}`
              );

              if (player) {
                user.videoTrack?.play(player);
              }
            }

            if (mediaType === 'audio') {
              user.audioTrack?.play();
            }

            setRemoteUsers((prev) => {
              const exists = prev.some(
                (item) => item.uid === user.uid
              );

              if (exists) return prev;

              return [...prev, user];
            });
          } catch (err) {
            console.error('Subscribe error:', err);
          }
        });

        client.on('user-unpublished', (user) => {
          setRemoteUsers((prev) =>
            prev.filter((item) => item.uid !== user.uid)
          );
        });

        client.on('user-left', (user) => {
          setRemoteUsers((prev) =>
            prev.filter((item) => item.uid !== user.uid)
          );
        });
      } catch (err) {
        console.error('Agora load error:', err);

        if (mounted) {
          setError('Agora load nahi ho saka.');
        }
      }
    }

    loadAgora();

    return () => {
      mounted = false;

      if (clientRef.current) {
        clientRef.current.leave().catch(() => {});
      }
    };
  }, []);

  async function joinCall() {
    if (loading || joined) return;

    try {
      setLoading(true);
      setError('');

      const AgoraRTC = AgoraRTCRef.current;

      if (!AgoraRTC || !clientRef.current) {
        throw new Error('Agora abhi load nahi hua.');
      }

      // Token server se lena
      const response = await fetch(
        `/api/token?channel=${encodeURIComponent(CHANNEL_NAME)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Token nahi mila.');
      }

      const { token, appId, channelName, uid } = data;

      if (!token || !appId || !channelName) {
        throw new Error('Token response incomplete hai.');
      }

      const client = clientRef.current;

      // Agora channel join
      await client.join(
        appId,
        channelName,
        token,
        uid || null
      );

      // Camera + microphone
      const tracks =
        await AgoraRTC.createMicrophoneAndCameraTracks();

      localTracksRef.current = tracks;

      const [microphoneTrack, cameraTrack] = tracks;

      await client.publish([
        microphoneTrack,
        cameraTrack
      ]);

      // Local video
      const localVideo = document.getElementById('local-video');

      if (localVideo) {
        cameraTrack.play(localVideo);
      }

      setJoined(true);
    } catch (err) {
      console.error('Join call error:', err);

      setError(
        err?.message || 'Call join nahi ho saki.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function leaveCall() {
    try {
      const tracks = localTracksRef.current;

      tracks.forEach((track) => {
        try {
          track.stop();
          track.close();
        } catch {}
      });

      localTracksRef.current = [];

      if (clientRef.current) {
        await clientRef.current.leave();
      }

      setJoined(false);
      setRemoteUsers([]);
    } catch (err) {
      console.error('Leave error:', err);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#fff',
        padding: '20px'
      }}
    >
      <h1>Wifty Free Call</h1>

      {!joined && (
        <button
          onClick={joinCall}
          disabled={loading}
          style={{
            padding: '14px 24px',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Joining...' : 'Join Call'}
        </button>
      )}

      {joined && (
        <button
          onClick={leaveCall}
          style={{
            padding: '14px 24px',
            fontSize: '18px',
            borderRadius: '10px',
            border: 'none',
            background: '#d32f2f',
            color: '#fff',
            marginBottom: '20px'
          }}
        >
          Leave Call
        </button>
      )}

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#3a1515',
            color: '#ff7777',
            borderRadius: '10px'
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px',
          marginTop: '25px'
        }}
      >
        {joined && (
          <div>
            <p>My Camera</p>

            <div
              id="local-video"
              style={{
                width: '100%',
                height: '300px',
                background: '#222',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            />
          </div>
        )}

        {remoteUsers.map((user) => (
          <div key={user.uid}>
            <p>User {user.uid}</p>

            <div
              id={`remote-video-${user.uid}`}
              style={{
                width: '100%',
                height: '300px',
                background: '#222',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
