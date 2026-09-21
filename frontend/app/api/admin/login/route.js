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

    // Forward to backend admin authentication endpoint
    if (backendUrl) {
      try {
        const res = await fetch(`${backendUrl}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      } catch (err) {
        console.warn('Backend admin login proxy warning:', err.message);
      }
    }

    // Direct JWT authentication for configured admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'sumukcrystalz@gmail.com').toLowerCase().trim();
    const adminPass = process.env.ADMIN_PASSWORD;

    if (adminPass && (cleanEmail !== adminEmail || password !== adminPass)) {
      return NextResponse.json({ error: 'Access Denied: Invalid administrator credentials.' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'JWT_SECRET is missing on server configuration.' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        sub: 'admin-001',
        id: 'admin-001',
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
      user: {
        id: 'admin-001',
        name: 'Soumyaa Naveen',
        email: cleanEmail,
        role: 'admin',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Login error: ' + err.message }, { status: 500 });
  }
}

