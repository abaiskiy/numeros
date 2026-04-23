import { NextResponse } from 'next/server';
import { checkPassword, buildToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/adminAuth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, buildToken(password), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
