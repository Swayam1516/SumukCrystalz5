import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { email, token, password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters in length.' },
        { status: 400 }
      );
    }

    const cleanEmail = email?.toLowerCase()?.trim();
    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    // 1. Verify reset token
    let verifiedEmail = cleanEmail;
    if (token) {
      try {
        const decoded = jwt.verify(token, secret);
        if (decoded.purpose !== 'password_reset' || !decoded.email) {
          return NextResponse.json({ error: 'Invalid password reset token.' }, { status: 400 });
        }
        verifiedEmail = decoded.email.toLowerCase().trim();
      } catch (jwtErr) {
        // Check if token was a Bearer session token
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser(token).catch(() => ({ data: {} }));
          if (user?.email) {
            verifiedEmail = user.email.toLowerCase().trim();
          } else {
            return NextResponse.json(
              { error: 'This password reset link has expired or is invalid. Please request a new one.' },
              { status: 400 }
            );
          }
        } else {
          return NextResponse.json(
            { error: 'This password reset link has expired or is invalid. Please request a new one.' },
            { status: 400 }
          );
        }
      }
    }

    if (!verifiedEmail) {
      return NextResponse.json({ error: 'Email address verification failed.' }, { status: 400 });
    }

    // 2. Hash new password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Update profiles and customers table in Supabase
    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            password_hash: passwordHash,
            updated_at: new Date().toISOString(),
          })
          .ilike('email', verifiedEmail);

        const { data: currentCust } = await supabase
          .from('customers')
          .select('shipping_address')
          .ilike('email', verifiedEmail)
          .maybeSingle();

        const updatedShipping = { ...(currentCust?.shipping_address || {}), password_hash: passwordHash };

        await supabase
          .from('customers')
          .update({
            shipping_address: updatedShipping,
            updated_at: new Date().toISOString(),
          })
          .ilike('email', verifiedEmail);
      } catch (dbErr) {
        console.warn('Database password update note:', dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been updated successfully. You can now sign in with your new credentials.',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
