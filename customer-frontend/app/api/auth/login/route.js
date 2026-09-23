import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../../lib/supabase';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sumukcrystalz@555';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    // 1. Founder Administrator Authentication
    if (
      cleanEmail === ADMIN_EMAIL ||
      cleanEmail === 'sumukcrystalz5@gmail.com' ||
      cleanEmail === 'sumukcrystalz@gmail.com'
    ) {
      if (password === ADMIN_PASSWORD || password === 'Sumukcrystalz@555') {
        const adminUser = {
          id: 'admin_founder_001',
          name: 'Soumyaa Naveen',
          fullName: 'Soumyaa Naveen',
          email: cleanEmail,
          role: 'admin',
        };
        const token = jwt.sign(
          {
            sub: adminUser.id,
            id: adminUser.id,
            name: adminUser.name,
            email: cleanEmail,
            role: 'admin',
          },
          secret,
          { expiresIn: '24h' }
        );
        return NextResponse.json({
          success: true,
          token,
          isAdmin: true,
          user: adminUser,
        });
      } else {
        return NextResponse.json({ error: 'Invalid email or password. Please verify your credentials.', success: false }, { status: 401 });
      }
    }

    // 2. Supabase Auth Native Verification
    let sbSession = null;
    let sbUser = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data?.session && data?.user) {
        sbSession = data.session;
        sbUser = data.user;
      }
    } catch (e) {}

    if (sbSession && sbUser) {
      const userObj = {
        id: sbUser.id,
        email: cleanEmail,
        name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || cleanEmail.split('@')[0],
        fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '',
        phone: sbUser.user_metadata?.phone || '',
        pincode: sbUser.user_metadata?.pincode || '',
        dob: sbUser.user_metadata?.dob || '',
        role: 'user',
      };

      return NextResponse.json({
        success: true,
        token: sbSession.access_token,
        isAdmin: false,
        user: userObj,
      });
    }

    // 3. Database Password Verification (Checks profiles & customers table)
    let dbUser = null;
    if (supabase) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (profile) {
          dbUser = profile;
        } else {
          const { data: customer } = await supabase
            .from('customers')
            .select('*')
            .ilike('email', cleanEmail)
            .maybeSingle();

          if (customer) {
            dbUser = customer;
          }
        }
      } catch (e) {}
    }

    if (dbUser) {
      const storedHash =
        dbUser.password_hash ||
        dbUser.passwordHash ||
        dbUser.shipping_address?.password_hash ||
        dbUser.shipping_address?.passwordHash;

      if (storedHash) {
        const isMatch = await bcrypt.compare(password, storedHash);
        if (!isMatch) {
          return NextResponse.json(
            { error: 'Invalid email or password. Please verify your credentials.', success: false },
            { status: 401 }
          );
        }

        const userId = dbUser.id || `usr_${Date.now()}`;
        const userName = dbUser.full_name || dbUser.name || cleanEmail.split('@')[0];
        const userObj = {
          id: userId,
          email: cleanEmail,
          name: userName,
          fullName: userName,
          phone: dbUser.phone || '',
          pincode: dbUser.shipping_address?.pincode || '',
          dob: dbUser.shipping_address?.dob || '',
          role: 'user',
        };

        const token = jwt.sign(
          {
            sub: userId,
            id: userId,
            name: userName,
            email: cleanEmail,
            role: 'user',
          },
          secret,
          { expiresIn: '7d' }
        );

        return NextResponse.json({
          success: true,
          token,
          isAdmin: false,
          user: userObj,
        });
      }
    }

    // If neither Supabase nor database verified the password
    return NextResponse.json(
      { error: 'Invalid email or password. Please verify your credentials.', success: false },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid email or password. Please verify your credentials.' },
      { status: 401 }
    );
  }
}
