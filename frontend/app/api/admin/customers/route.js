import { NextResponse } from 'next/server';
import { getSupabaseCustomers } from '../../../../lib/supabase';
import { verifyAdminAuth } from '../../../../lib/auth-middleware';

export async function GET(request) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const customers = await getSupabaseCustomers();
    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch customers: ' + err.message }, { status: 500 });
  }
}
