import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import Razorpay from 'razorpay';

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to upgrade.' }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys are not configured.' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amount = 40000; // 400 INR in paise

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `pro_${Date.now().toString().slice(-8)}_${Math.random().toString(36).slice(2, 6)}`,
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment order.', details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
