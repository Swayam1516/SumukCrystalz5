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
    let profile = {
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
          profile = {
            ...profile,
            ...dbProfile,
            name: dbProfile.full_name || dbProfile.name || profile.name,
          };
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      user: profile,
    });
  } catch (err) {
    console.error('Profile GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}

export async function PUT(request) {
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

    const body = await request.json();
    const { name, fullName, phone, addresses } = body;
    const cleanEmail = decoded.email?.toLowerCase().trim();
    const cleanName = fullName?.trim() || name?.trim();

    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (cleanName) {
      updates.full_name = cleanName;
      updates.name = cleanName;
    }
    if (phone !== undefined) updates.phone = phone;
    if (addresses !== undefined) updates.addresses = addresses;

    if (supabase && cleanEmail) {
      try {
        await supabase
          .from('profiles')
          .update(updates)
          .ilike('email', cleanEmail);
      } catch (err) {
        console.warn('Supabase profile update warning:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...decoded,
        ...updates,
      },
    });
  } catch (err) {
    console.error('Profile PUT error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
