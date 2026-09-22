import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../../lib/supabase';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const cleanEmail = decoded.email?.toLowerCase().trim();
    let userProfile = {
      id: decoded.sub || decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || 'user',
    };

    if (supabase && cleanEmail) {
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('id, full_name, name, email, phone, role, created_at, updated_at')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (dbProfile) {
          userProfile = {
            ...userProfile,
            ...dbProfile,
            name: dbProfile.full_name || dbProfile.name || userProfile.name,
          };
        }
      } catch (err) {
        console.warn('Supabase profile lookup in me route notice:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (err) {
    console.error('Auth /me error:', err);
    return NextResponse.json({ error: 'Failed to retrieve authenticated user' }, { status: 500 });
  }
}
