import { NextResponse } from 'next/server';
import { getSystemConfig } from '@/lib/config';

export async function GET() {
  try {
    const config = await getSystemConfig();
    return NextResponse.json({
      success: true,
      freeAiLimit: config.freeAiLimit,
      freeLearnLimit: config.freeLearnLimit,
      freePracticeLimitBeforeLogin: config.freePracticeLimitBeforeLogin,
    });
  } catch (error: any) {
    console.error('Error fetching public system config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch configuration.' },
      { status: 500 }
    );
  }
}
