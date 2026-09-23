import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/supabase';
import { sendPasswordResetEmail } from '../../../../lib/notify';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    // 1. Search for customer name in database
    let customerName = cleanEmail.split('@')[0];
    if (supabase) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, name')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (profile) {
          customerName = profile.full_name || profile.name || customerName;
        }
      } catch (e) {}
    }

    // 2. Generate secure 1-hour cryptographic reset token
    const resetToken = jwt.sign(
      {
        email: cleanEmail,
        purpose: 'password_reset',
      },
      secret,
      { expiresIn: '1h' }
    );

    // 3. Formulate redirect link
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const resetLink = `${protocol}://${host}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(cleanEmail)}`;

    // 4. Send luxury password reset email via Brevo SMTP
    sendPasswordResetEmail({
      toEmail: cleanEmail,
      customerName,
      resetLink,
    }).catch((err) => console.warn('Brevo reset email dispatch notice:', err?.message));

    // 5. Also trigger Supabase reset password in background
    if (supabase) {
      supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${protocol}://${host}/reset-password`,
      }).catch(() => {});
    }

    // Always return neutral security response
    return NextResponse.json({
      success: true,
      message: "If an account exists for this email, we've sent a secure password reset link. Please check your inbox and spam folder.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: true, message: "If an account exists for this email, we've sent a secure password reset link. Please check your inbox and spam folder." },
      { status: 200 }
    );
  }
}
