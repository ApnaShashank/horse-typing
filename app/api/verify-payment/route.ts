import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing required payment verification fields.' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay keys are not configured.' }, { status: 500 });
    }

    // Verify signature signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed. Mismatch detected.' }, { status: 400 });
    }

    // Update user status in database
    await prisma.user.update({
      where: { id: session.userId },
      data: { isPro: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. You are now a PRO member!',
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Verification failed.', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
