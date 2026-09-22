import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5000';

    // 1. Forward to backend auth service if available
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const data = await res.json();
        if (res.status < 500) {
          return NextResponse.json(data, { status: res.status });
        }
      } catch (err) {
        console.warn('Backend proxy auth notice:', err.message);
      }
    }

    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    // 2. Founder Admin Direct Check
    const adminEmail = (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD || 'Sumukcrystalz@555';

    if (
      cleanEmail === adminEmail ||
      cleanEmail === 'sumukcrystalz5@gmail.com' ||
      cleanEmail === 'sumukcrystalz@gmail.com'
    ) {
      if (password !== adminPass && password !== 'Sumukcrystalz@555') {
        return NextResponse.json({ error: 'Invalid administrator credentials.' }, { status: 401 });
      }
      const adminUser = {
        id: 'admin_founder_001',
        name: 'Soumyaa Naveen',
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
    }

    // 3. Fallback: Query Supabase for patron user and verify bcrypt password
    let user = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data && !error) {
          user = data;
        }
      } catch (e) {
        console.warn('Supabase patron lookup notice:', e.message);
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const storedHash = user.password_hash || user.passwordHash;
    if (!storedHash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, storedHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const userId = user.id || `usr_${Date.now()}`;
    const name = user.full_name || user.name || cleanEmail.split('@')[0] || 'Valued Patron';
    const role = user.role || 'user';

    const token = jwt.sign(
      {
        sub: userId,
        id: userId,
        name,
        email: cleanEmail,
        role,
      },
      secret,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email: cleanEmail,
        role,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Login error: ' + err.message }, { status: 500 });
  }
}


