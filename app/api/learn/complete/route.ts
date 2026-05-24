import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await req.json();
    if (typeof lessonId !== 'number') {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { completedLessons: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add lessonId to array if it is not already completed
    if (!user.completedLessons.includes(lessonId)) {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          completedLessons: {
            push: lessonId
          }
        }
      });
    }

    return NextResponse.json({ success: true, completedLessons: [...user.completedLessons, lessonId] });
  } catch (error: any) {
    console.error('Error logging lesson completion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
