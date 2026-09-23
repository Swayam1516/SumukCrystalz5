import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../../lib/supabase';
import { sendWelcomeEmail } from '../../../../lib/notify';

const ADMIN_EMAIL = 'sumukcrystalz5@gmail.com';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, pincode, dob, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];
    const cleanPhone = phone?.trim() || '';
    const cleanPincode = pincode?.trim() || '';
    const cleanDob = dob?.trim() || '';

    // Create authentic Supabase user
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          name: cleanName,
          phone: cleanPhone,
          pincode: cleanPincode,
          dob: cleanDob,
          role: cleanEmail === ADMIN_EMAIL ? 'admin' : 'user',
        },
      },
    });

    if (error) {
      let errorMsg = error.message;
      if (
        error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('user already exists')
      ) {
        return NextResponse.json(
          {
            error: `An account with ${cleanEmail} already exists. Please sign in.`,
            message: `An account with ${cleanEmail} already exists. Please sign in.`,
          },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return NextResponse.json(
        {
          error: `An account with ${cleanEmail} already exists. Please sign in.`,
          message: `An account with ${cleanEmail} already exists. Please sign in.`,
        },
        { status: 409 }
      );
    }

    const createdUser = data?.user;
    const session = data?.session;
    const isAdmin = cleanEmail === ADMIN_EMAIL;

    const userObj = {
      id: createdUser?.id || `usr_${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      fullName: cleanName,
      phone: cleanPhone,
      pincode: cleanPincode,
      dob: cleanDob,
      role: isAdmin ? 'admin' : 'user',
    };

    // Hash password with bcrypt for secure database authentication
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save profile to Supabase profiles & customers table
    if (createdUser?.id) {
      supabase
        .from('profiles')
        .upsert({
          id: createdUser.id,
          full_name: cleanName,
          phone: cleanPhone,
          address: cleanPincode ? `Pincode: ${cleanPincode}` : '',
          created_at: new Date().toISOString(),
        })
        .then(() => {}, () => {});

      supabase
        .from('customers')
        .upsert(
          {
            id: createdUser.id,
            full_name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            shipping_address: { pincode: cleanPincode, dob: cleanDob, password_hash: passwordHash },
            created_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
        .then(() => {}, () => {});
    }

    // Send Welcome Email asynchronously
    sendWelcomeEmail({
      customerName: cleanName,
      customerEmail: cleanEmail,
      username: cleanEmail.split('@')[0],
      registrationDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }).catch((e) => console.warn('Welcome email note:', e.message));

    return NextResponse.json(
      {
        success: true,
        user: userObj,
        token: session?.access_token || null,
        sessionActive: !!session?.access_token,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
