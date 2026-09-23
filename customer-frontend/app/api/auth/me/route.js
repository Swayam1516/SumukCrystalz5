import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

const ADMIN_EMAIL = 'sumukcrystalz5@gmail.com';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token with Supabase Auth
    const { data: { user: sbUser }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !sbUser) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const cleanEmail = (sbUser.email || '').toLowerCase().trim();
    const isAdmin = cleanEmail === ADMIN_EMAIL || sbUser.user_metadata?.role === 'admin';

    let userProfile = {
      id: sbUser.id,
      email: cleanEmail,
      name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || cleanEmail.split('@')[0],
      fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '',
      phone: sbUser.user_metadata?.phone || '',
      pincode: sbUser.user_metadata?.pincode || '',
      dob: sbUser.user_metadata?.dob || '',
      role: isAdmin ? 'admin' : 'user',
    };

    // Enrich with database profile
    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (dbProfile) {
        userProfile = {
          ...userProfile,
          ...dbProfile,
          name: dbProfile.full_name || dbProfile.name || userProfile.name,
        };
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve authenticated user' }, { status: 500 });
  }
}
