import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../../../../lib/notify';
import { supabase, saveCustomerToSupabase } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, pincode, dob, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required for registration' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'Password is required for registration' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const customerName = fullName?.trim() || cleanEmail.split('@')[0] || 'Valued Patron';
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5000';

    // 1. Attempt to forward registration to backend auth service
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: customerName,
            email: cleanEmail,
            phone: phone || '',
            pincode: pincode || '',
            dob: dob || '',
            password,
          }),
        });

        const data = await res.json();
        // If backend processed the request (including 409 duplicate email or 400 validation error or 201 success)
        if (res.status < 500) {
          return NextResponse.json(data, { status: res.status });
        }
      } catch (err) {
        console.warn('Backend proxy registration note:', err.message);
      }
    }

    // 2. Standalone / Fallback Supabase Mode
    // Search Supabase profiles and customers for existing registration
    if (supabase) {
      try {
        let isExisting = false;
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email, full_name, role')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (existingProfile) {
          isExisting = true;
        } else {
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id, email, full_name')
            .ilike('email', cleanEmail)
            .maybeSingle();

          if (existingCustomer) {
            isExisting = true;
          }
        }

        if (isExisting) {
          return NextResponse.json(
            {
              success: false,
              error: `This email address (${cleanEmail}) is already registered. Please sign in with your credentials or use a different email.`,
              message: `This email address (${cleanEmail}) is already registered. Please sign in with your credentials or use a different email.`,
            },
            { status: 409 }
          );
        }
      } catch (e) {
        console.warn('Supabase duplicate check notice:', e.message);
      }
    }

    const isAdmin = cleanEmail === 'sumukcrystalz5@gmail.com' || cleanEmail === 'sumukcrystalz@gmail.com';
    const role = isAdmin ? 'admin' : 'user';
    const userId = `usr_${Date.now()}`;

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save profile to Supabase
    if (supabase) {
      try {
        await supabase.from('profiles').upsert(
          {
            id: userId,
            full_name: customerName,
            name: customerName,
            email: cleanEmail,
            phone: phone || '',
            password_hash: passwordHash,
            role,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        );
      } catch (e) {}
    }

    // Save Customer Sync
    saveCustomerToSupabase({
      fullName: customerName,
      email: cleanEmail,
      phone: phone || '',
      shippingAddress: { pincode, dob },
      totalOrders: 0,
      totalSpent: 0,
    }).catch((e) => console.warn('Supabase registration sync notice:', e.message));

    // Send Welcome Email asynchronously
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

    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';
    const token = jwt.sign(
      {
        sub: userId,
        id: userId,
        name: customerName,
        email: cleanEmail,
        role,
      },
      secret,
      { expiresIn: role === 'admin' ? '24h' : '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        token,
        message: 'Registration successful and welcome email dispatched.',
        user: {
          id: userId,
          name: customerName,
          email: cleanEmail,
          role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Registration failed: ' + err.message }, { status: 500 });
  }
}

