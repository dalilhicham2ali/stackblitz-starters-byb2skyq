import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function GET() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    
    return NextResponse.json({
      isAuthenticated: !!session.user,
      user: session.user || null
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      error: 'Session error' 
    }, { 
      status: 200 // Still return 200 to avoid parsing errors
    });
  }
}