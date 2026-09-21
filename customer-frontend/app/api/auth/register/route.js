import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../../../../lib/notify';
import { saveCustomerToSupabase } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, pincode, dob } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required for registration' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const customerName = fullName?.trim() || cleanEmail.split('@')[0] || 'Valued Patron';
    const isAdmin = cleanEmail === 'sumukcrystalz@gmail.com' || cleanEmail === 'admin@brand.com';
    const role = isAdmin ? 'admin' : 'user';
    const userId = `user_${Date.now()}`;

    // Save to Supabase
    saveCustomerToSupabase({
      fullName: customerName,
      email: cleanEmail,
      phone: phone || '',
      shippingAddress: { pincode, dob },
      totalOrders: 0,
      totalSpent: 0,
    }).catch((e) => console.warn('Supabase registration sync notice:', e.message));

    // Send Welcome Email asynchronously via Brevo SMTP
    sendWelcomeEmail({
      customerName,
      customerEmail: cleanEmail,
      username: cleanEmail.split('@')[0],
      registrationDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }).catch((e) => console.warn('Welcome email error:', e.message));

    const secret = process.env.JWT_SECRET;
    let token = null;
    if (secret) {
      token = jwt.sign(
        {
          sub: userId,
          name: customerName,
          email: cleanEmail,
          role,
        },
        secret,
        { expiresIn: '7d' }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      message: 'Registration successful and welcome email dispatched.',
      user: {
        id: userId,
        name: customerName,
        email: cleanEmail,
        role,
      },
    });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Registration failed: ' + err.message }, { status: 500 });
  }
}
