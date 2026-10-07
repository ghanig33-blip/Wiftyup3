  const joinCall = async () => {
    if (!agoraClientRef.current || typeof window === 'undefined') return;
    setLoading(true);

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

      // 1. First request tracks directly to trigger Chrome native prompt
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        {
          encoderConfig: {
            width: { max: 640 },
            height: { max: 360 },
            frameRate: 15,
            bitrateMin: 60,
            bitrateMax: 400,
          },
        }
      );

      // 2. Join channel after tracks are granted
      await agoraClientRef.current.join(APP_ID, CHANNEL, null, null);

      localTracksRef.current = [audioTrack, videoTrack];

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }
      await agoraClientRef.current.publish([audioTrack, videoTrack]);
      setJoined(true);
    } catch (err) {
      console.error("Agora Track Error:", err);
      // Fallback log display on screen for debugging
      alert(`Camera Access Error: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };
