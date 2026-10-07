'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoCallPage() {
  const router = useRouter();
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const agoraClientRef = useRef(null);
  const localTracksRef = useRef([]);

  const APP_ID = 'fe1f95d122e24d269877eb372e915fa8'; 
  const CHANNEL = 'wiftyup-room';

  useEffect(() => {
    let isMounted = true;

    const initAgora = async () => {
      if (typeof window !== 'undefined') {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        if (!isMounted) return;

        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        agoraClientRef.current = client;

        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'video' && remoteVideoRef.current) {
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === 'audio') {
            user.audioTrack.play();
          }
        });

        client.on('user-unpublished', () => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = '';
          }
        });
      }
    };

    initAgora();

    return () => {
      isMounted = false;
      leaveCall();
    };
  }, []);

  const joinCall = async () => {
    if (!agoraClientRef.current || typeof window === 'undefined') return;
    setLoading(true);

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      await agoraClientRef.current.join(APP_ID, CHANNEL, null, null);

      // Create tracks directly without throw alerts
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localTracksRef.current = [audioTrack, videoTrack];

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }
      await agoraClientRef.current.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Agora Track Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const leaveCall = async () => {
    if (localTracksRef.current.length > 0) {
      localTracksRef.current.forEach((track) => {
        track.stop();
        track.close();
      });
      localTracksRef.current = [];
    }
    if (agoraClientRef.current) {
      await agoraClientRef.current.leave();
    }
    setJoined(false);
    router.push('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gray-950 text-white p-4">
      <div className="w-full max-w-4xl flex justify-between items-center py-2 border-b border-gray-800">
        <h1 className="text-lg font-bold text-blue-500">WiftyUp HD Video Call</h1>
        <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
          Global Low-Latency
        </span>
      </div>

      <div className="flex-1 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 py-4 my-auto items-center">
        <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
          <div ref={localVideoRef} className="w-full h-full object-cover"></div>
          <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs">
            You (Local)
          </span>
        </div>

        <div className="relative w-full h-64 md:h-80 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
          <div ref={remoteVideoRef} className="w-full h-full object-cover"></div>
          <span className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs">
            Remote Peer
          </span>
        </div>
      </div>

      <div className="pb-6 flex items-center gap-4">
        {!joined ? (
          <button
            onClick={joinCall}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 shadow-lg transition"
          >
            {loading ? 'Connecting...' : '📹 Start Call'}
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
