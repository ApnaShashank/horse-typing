import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        isPro: true,
        aiPracticeCount: true,
        completedLessons: true,
        practiceRunsCount: true,
        userStat: true,
        testResults: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            mode: true,
            wpm: true,
            accuracy: true,
            createdAt: true,
          }
        }
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
