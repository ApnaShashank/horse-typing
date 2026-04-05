import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'time 15'; // default

  try {
    const topScores = await prisma.leaderboard.findMany({
      where: {
        mode: mode
      },
      orderBy: [
        { wpm: 'desc' },
        { accuracy: 'desc' }
      ],
      take: 50,
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ scores: topScores });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
