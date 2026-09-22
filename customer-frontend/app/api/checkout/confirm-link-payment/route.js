import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Legacy manual payment confirmation has been permanently removed. Use official Razorpay Standard Checkout.' },
    { status: 410 }
  );
}

