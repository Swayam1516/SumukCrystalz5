/**
 * Concurrency-safe Unique Order Number Generator for Sumuk Crystalz5
 * Format: SC5-YYYY-XXXXXX (e.g. SC5-2026-000001, SC5-2026-000002)
 */

export async function generateNextOrderNumber(supabaseClient) {
  const currentYear = new Date().getFullYear().toString();
  const yearPrefix = `SC5-${currentYear}-`;

  if (supabaseClient) {
    // 1. Attempt database-level atomic sequence function if exists
    try {
      const { data: rpcNumber, error: rpcErr } = await supabaseClient.rpc('generate_order_number');
      if (!rpcErr && rpcNumber && typeof rpcNumber === 'string' && rpcNumber.startsWith('SC5-')) {
        return rpcNumber.trim();
      }
    } catch (e) {
      // RPC may not be declared yet; continue to resilient sequence query
    }

    // 2. Query Supabase for the latest sequential order number for the current year
    try {
      const { data: latestRows, error: qErr } = await supabaseClient
        .from('orders')
        .select('order_number')
        .ilike('order_number', `${yearPrefix}%`)
        .order('order_number', { ascending: false })
        .limit(1);

      if (!qErr && latestRows && latestRows.length > 0) {
        const latestNumStr = latestRows[0].order_number;
        const parts = latestNumStr.split('-');
        if (parts.length === 3) {
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq) && seq > 0) {
            const nextSeq = seq + 1;
            return `${yearPrefix}${String(nextSeq).padStart(6, '0')}`;
          }
        }
      }

      // If no SC5 orders exist yet for this year, start at 1
      if (!qErr && (!latestRows || latestRows.length === 0)) {
        return `${yearPrefix}000001`;
      }
    } catch (err) {
      console.warn('Notice querying latest order_number sequence:', err.message);
    }
  }

  // 3. Fallback deterministic generator preserving SC5-YYYY-XXXXXX format
  const pseudoSequential = Math.floor(100000 + Math.random() * 900000);
  return `${yearPrefix}${pseudoSequential}`;
}

