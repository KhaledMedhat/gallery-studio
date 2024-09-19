import { serialize } from 'cookie';
import { encode } from 'next-auth/jwt';

export async function setSessionCookie(sessionToken: string, session: object) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");

  const token = await encode({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    token: { ...session, sessionToken },
    secret,
  });

  const cookie = serialize('next-auth.session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return cookie
  // You'll need to set this cookie in the response
  // This depends on how you're handling responses in your API
  // For example, if you're using Next.js API routes:
  // res.setHeader('Set-Cookie', cookie);
}