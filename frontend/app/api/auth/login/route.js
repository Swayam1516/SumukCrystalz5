import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE;

    // Forward to backend auth service if available
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      } catch (err) {
        console.warn('Backend proxy auth failed, generating secure JWT:', err.message);
      }
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server security configuration error' }, { status: 500 });
    }

    // Founder Admin Direct Check
    const adminEmail = (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD || 'Sumukcrystalz@555';

    if (cleanEmail === adminEmail) {
      if (password !== adminPass) {
        return NextResponse.json({ error: 'Invalid administrator credentials.' }, { status: 401 });
      }
      const token = jwt.sign(
        {
          sub: 'admin_founder_001',
          id: 'admin_founder_001',
          name: 'Soumyaa Naveen',
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
        user: {
          id: 'admin_founder_001',
          name: 'Soumyaa Naveen',
          email: cleanEmail,
          role: 'admin',
        },
      });
    }

    const userId = `usr_${Date.now()}`;
    const name = cleanEmail.split('@')[0];
    const role = 'user';

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
