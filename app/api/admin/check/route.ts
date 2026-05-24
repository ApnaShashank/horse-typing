import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const session = await getAdminSession();
  if (session && session.isAdmin) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
