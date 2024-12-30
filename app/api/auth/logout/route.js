import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function POST() {
  const session = await getIronSession(cookies(), sessionOptions);
  session.destroy();
  return NextResponse.json({ success: true });
}