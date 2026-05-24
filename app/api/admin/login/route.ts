import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === 'admin@horsetyping' && password === 'Red-Danger-102') {
      await createAdminSession();
      return NextResponse.json({ success: true, message: 'Admin login successful.' });
    }

    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  } catch (error: any) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
