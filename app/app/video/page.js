'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoCallPage() {
  const router = useRouter();
  const [joined, setJoined] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const agoraClientRef = useRef(null);
  const localTracksRef = useRef([]);

  // Free Agora Testing App ID (Global Test Channel)
  const APP_ID = 'fe1f95d122e24d269877eb372e915fa8'; 
  const CHANNEL = 'wiftyup-room';

  useEffect(() => {
    // Dynamic import to support SSR in Next.js
    import('agora-rtc-sdk-ng').then(async (AgoraRTC) => {
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      agoraClientRef.current = client;

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          user.videoTrack.play(remoteVideoRef.current);
        }
        if (mediaType === 'audio') {
          user.audioTrack.play();
        }
      });

      client.on('user-unpublished', (user) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.innerHTML = '';
        }
      });
    });

    return () => {
      leaveCall();
    };
  }, []);

  const joinCall = async () => {
    if (!agoraClientRef.current) return;
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

    try {
      await agoraClientRef.current.join(APP_ID, CHANNEL, null, null);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = [audioTrack, videoTrack];

      videoTrack.play(localVideoRef.current);
      await agoraClientRef.current.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Failed to join video call:", err);
      alert("Microphone & Camera permission required for Video Calling.");
    }
  };

  const leaveCall = async () => {
    localTracksRef.current.forEach((track) => {
      track.stop();
      track.close();
    });
    if (agoraClientRef.current) {
      await agoraClientRef.current.leave();
    }
    setJoined(false);
    router.push('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-950 text-white p-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center py-2 border-b border-gray-800">
        <h1 className="text-lg font-bold text-blue-500">WiftyUp HD Video Call</h1>
        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
          Global Low-Latency
        </span>
      </div>

      {/* Video Screens Grid */}
      <div className="flex-1 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 py-4 my-auto items-center">
        {/* Local Video */}
        <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
          <div ref={localVideoRef} className="w-full h-full object-cover"></div>
          <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs">
            You (Local)
          </span>
        </div>

        {/* Remote Video */}
        <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
          <div ref={remoteVideoRef} className="w-full h-full object-cover"></div>
          <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs">
            Remote Peer
          </span>
        </div>
      </div>

      {/* Call Controls */}
      <div className="pb-6 flex items-center gap-4">
        {!joined ? (
          <button
            onClick={joinCall}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition"
          >
            📹 Start Call
          </button>
        ) : (
          <button
            onClick={leaveCall}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition"
          >
            🚫 End Call
          </button>
        )}
      </div>
    </div>
  );
}

