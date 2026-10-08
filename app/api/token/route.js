import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const channelName = searchParams.get('channel');

    if (!channelName) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      );
    }

    const APP_ID = process.env.AGORA_APP_ID;
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

    if (!APP_ID || !APP_CERTIFICATE) {
      return NextResponse.json(
        { error: 'Agora environment variables are missing' },
        { status: 500 }
      );
    }

    const uid = 0;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs =
      currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return NextResponse.json({
      token,
      appId: APP_ID,
      channelName,
      uid
    });

  } catch (error) {
    console.error('Agora token error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate Agora token'
      },
      { status: 500 }
    );
  }
}
