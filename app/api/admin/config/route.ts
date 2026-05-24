import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';
import { getSystemConfig } from '@/lib/config';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await getSystemConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('Error fetching admin config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { freeAiLimit, freeLearnLimit, freePracticeLimitBeforeLogin } = await req.json();

    const currentConfig = await getSystemConfig() as any;

    const updated = await prisma.systemConfig.update({
      where: { id: currentConfig.id },
      data: {
        freeAiLimit: Number(freeAiLimit),
        freeLearnLimit: Number(freeLearnLimit),
        freePracticeLimitBeforeLogin: Number(freePracticeLimitBeforeLogin),
      },
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    console.error('Error updating config:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
