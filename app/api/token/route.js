import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelName = searchParams.get('channel') || 'wiftyup-room';

  // WiftyFreeCall Project App ID
  const APP_ID = 'a2eab83e53e1461f881ede90e5ce48ca';
  
  // Agora Console se copy kiya hua Primary Certificate yahan quotes ke andar paste karein:
  const APP_CERTIFICATE = 'PASTE_YOUR_PRIMARY_CERTIFICATE_HERE'; 

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour validity
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      0,
      role,
      privilegeExpiredTs
    );
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
