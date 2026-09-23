/**
 * SUMUK CRYSTALZ 5 • SERVER-SIDE DYNAMIC PINCODE & DISTANCE SHIPPING ENGINE
 * Origin: Pune, Maharashtra (18.5204° N, 73.8567° E)
 */

const DEFAULT_DELIVERY_SETTINGS = {
  origin_city: 'Pune',
  origin_state: 'Maharashtra',
  origin_lat: 18.5204,
  origin_lng: 73.8567,
  tier_1_max_km: 50,
  tier_1_fee: 50,
  tier_2_max_km: 150,
  tier_2_fee: 100,
  interstate_fee: 150,
  free_shipping_threshold: 5000,
  is_free_shipping_enabled: true,
};

// Known coordinates reference points for major Indian postal zones
const PINCODE_PREFIX_COORDINATES = {
  // Pune Metropolitan & Suburbs (Tier 1 ~ 0-45 km)
  '411': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
  '412': { lat: 18.5500, lng: 73.9500, city: 'Pune Suburbs / Pimpri', state: 'Maharashtra' },

  // Maharashtra Tier 2 / Regional Hubs (50-150 km)
  '400': { lat: 18.9220, lng: 72.8347, city: 'Mumbai', state: 'Maharashtra' },
  '401': { lat: 19.3919, lng: 72.8397, city: 'Thane / Palghar', state: 'Maharashtra' },
  '410': { lat: 18.7500, lng: 73.4000, city: 'Lonavala / Raigad', state: 'Maharashtra' },
  '414': { lat: 19.0952, lng: 74.7496, city: 'Ahmednagar', state: 'Maharashtra' },
  '415': { lat: 17.6805, lng: 74.0183, city: 'Satara', state: 'Maharashtra' },

  // Maharashtra Far Regional (> 150 km)
  '413': { lat: 17.6599, lng: 75.9064, city: 'Solapur', state: 'Maharashtra' },
  '416': { lat: 16.7050, lng: 74.2433, city: 'Kolhapur', state: 'Maharashtra' },
  '421': { lat: 19.2437, lng: 73.1355, city: 'Kalyan / Dombivli', state: 'Maharashtra' },
  '422': { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' },
  '431': { lat: 19.8762, lng: 75.3433, city: 'Aurangabad', state: 'Maharashtra' },
  '440': { lat: 21.1458, lng: 79.0882, city: 'Nagpur', state: 'Maharashtra' },

  // Interstate
  '560': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  '500': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  '600': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  '380': { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  '110': { lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  '700': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
};

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates server-side verified shipping fee
 */
function calculateServerDeliveryFee(pincode, subtotal = 0, customSettings = null) {
  const settings = { ...DEFAULT_DELIVERY_SETTINGS, ...(customSettings || {}) };

  // Free shipping check
  if (
    Boolean(settings.is_free_shipping_enabled) &&
    Number(subtotal) >= Number(settings.free_shipping_threshold || 5000)
  ) {
    return 0;
  }

  const cleanPin = String(pincode || '').replace(/\D/g, '').slice(0, 6);
  if (!cleanPin || cleanPin.length !== 6) {
    return Number(settings.interstate_fee || 150);
  }

  const prefix3 = cleanPin.slice(0, 3);
  const prefix2 = cleanPin.slice(0, 2);

  // 1. Direct Pune District Check (411xxx, 412xxx)
  if (prefix3 === '411' || prefix3 === '412') {
    return Number(settings.tier_1_fee || 50);
  }

  // 2. Lookup known coordinate
  const geo = PINCODE_PREFIX_COORDINATES[prefix3];
  if (geo) {
    const isInterstate = geo.state.toLowerCase() !== settings.origin_state.toLowerCase();
    if (isInterstate) {
      return Number(settings.interstate_fee || 150);
    }

    const dist = calculateHaversineDistance(
      settings.origin_lat,
      settings.origin_lng,
      geo.lat,
      geo.lng
    );

    if (dist <= Number(settings.tier_1_max_km || 50)) {
      return Number(settings.tier_1_fee || 50);
    } else if (dist <= Number(settings.tier_2_max_km || 150)) {
      return Number(settings.tier_2_fee || 100);
    } else {
      return Number(settings.interstate_fee || 150);
    }
  }

  // 3. Fallback based on 2-digit Maharashtra state prefix (40-44)
  const isMaharashtra = ['40', '41', '42', '43', '44'].includes(prefix2);
  if (isMaharashtra) {
    return Number(settings.tier_2_fee || 100);
  }

  return Number(settings.interstate_fee || 150);
}

module.exports = {
  DEFAULT_DELIVERY_SETTINGS,
  calculateServerDeliveryFee,
};
