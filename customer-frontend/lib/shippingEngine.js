/**
 * =========================================================================
 * SUMUK CRYSTALZ 5 • DYNAMIC PINCODE & DISTANCE-BASED SHIPPING ENGINE
 * =========================================================================
 * Origin: Pune, Maharashtra (18.5204° N, 73.8567° E)
 * Tiers:
 *  - Tier 1: Intra-state, <= 50 km from Pune (Default: ₹50)
 *  - Tier 2: Intra-state, 51 km - 150 km from Pune (Default: ₹100)
 *  - Interstate: Outside Maharashtra or > Tier 2 distance (Default: ₹150)
 *  - Free Shipping: Applicable when subtotal exceeds threshold (Default: ₹5,000)
 */

export const DEFAULT_DELIVERY_SETTINGS = {
  id: 'global',
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

// Known coordinate reference points for major Indian postal zones & Maharashtra hubs
const PINCODE_PREFIX_COORDINATES = {
  // Pune Metropolitan & immediate suburbs (Tier 1 ~ 0-45 km)
  '411': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra', isPune: true },
  '412': { lat: 18.5500, lng: 73.9500, city: 'Pune Rural / Haveli / Pimpri', state: 'Maharashtra', isPune: true },

  // Maharashtra Tier 2 / Regional Hubs (Mumbai, Thane, Raigad, Satara, Ahmednagar ~ 50-150 km)
  '400': { lat: 18.9220, lng: 72.8347, city: 'Mumbai', state: 'Maharashtra' }, // ~120 km
  '401': { lat: 19.3919, lng: 72.8397, city: 'Thane / Palghar', state: 'Maharashtra' }, // ~140 km
  '410': { lat: 18.7500, lng: 73.4000, city: 'Lonavala / Khopoli / Raigad', state: 'Maharashtra' }, // ~65 km
  '414': { lat: 19.0952, lng: 74.7496, city: 'Ahmednagar', state: 'Maharashtra' }, // ~120 km
  '415': { lat: 17.6805, lng: 74.0183, city: 'Satara', state: 'Maharashtra' }, // ~110 km

  // Maharashtra Far Regional (> 150 km)
  '413': { lat: 17.6599, lng: 75.9064, city: 'Solapur', state: 'Maharashtra' }, // ~250 km
  '416': { lat: 16.7050, lng: 74.2433, city: 'Kolhapur / Sangli', state: 'Maharashtra' }, // ~230 km
  '421': { lat: 19.2437, lng: 73.1355, city: 'Kalyan / Dombivli', state: 'Maharashtra' }, // ~135 km
  '422': { lat: 19.9975, lng: 73.7898, city: 'Nashik', state: 'Maharashtra' }, // ~165 km
  '423': { lat: 20.5579, lng: 74.5287, city: 'Malegaon', state: 'Maharashtra' }, // ~240 km
  '424': { lat: 20.9042, lng: 74.7749, city: 'Dhule', state: 'Maharashtra' }, // ~310 km
  '425': { lat: 21.0077, lng: 75.5626, city: 'Jalgaon', state: 'Maharashtra' }, // ~370 km
  '431': { lat: 19.8762, lng: 75.3433, city: 'Aurangabad / Chhatrapati Sambhajinagar', state: 'Maharashtra' }, // ~235 km
  '440': { lat: 21.1458, lng: 79.0882, city: 'Nagpur', state: 'Maharashtra' }, // ~700 km
  '444': { lat: 20.7002, lng: 77.0082, city: 'Akola / Amravati', state: 'Maharashtra' }, // ~500 km

  // Goa (403xxx)
  '403': { lat: 15.2993, lng: 74.1240, city: 'Goa', state: 'Goa' },

  // Interstate Major Postal Hubs
  // Karnataka (560xxx - 599xxx)
  '560': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  '570': { lat: 12.2958, lng: 76.6394, city: 'Mysuru', state: 'Karnataka' },
  '580': { lat: 15.3647, lng: 75.1240, city: 'Hubli / Dharwad', state: 'Karnataka' },
  '590': { lat: 15.8497, lng: 74.4977, city: 'Belagavi', state: 'Karnataka' },

  // Telangana & Andhra Pradesh (500xxx - 539xxx)
  '500': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  '530': { lat: 17.6868, lng: 83.2185, city: 'Visakhapatnam', state: 'Andhra Pradesh' },

  // Tamil Nadu & Kerala (600xxx - 699xxx)
  '600': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  '641': { lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu' },
  '682': { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },

  // Gujarat (360xxx - 399xxx)
  '380': { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  '395': { lat: 21.1702, lng: 72.8311, city: 'Surat', state: 'Gujarat' },
  '390': { lat: 22.3072, lng: 73.1812, city: 'Vadodara', state: 'Gujarat' },

  // Delhi NCR & North (110xxx, 120xxx, 201xxx)
  '110': { lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  '122': { lat: 28.4595, lng: 77.0266, city: 'Gurugram', state: 'Haryana' },
  '201': { lat: 28.5355, lng: 77.3910, city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
  '226': { lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' },
  '302': { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  '700': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
  '800': { lat: 25.5941, lng: 85.1376, city: 'Patna', state: 'Bihar' },
  '462': { lat: 23.2599, lng: 77.4126, city: 'Bhopal / Indore', state: 'Madhya Pradesh' },
};

/**
 * Calculates Great-Circle / Haversine Distance in Kilometers between two coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
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
 * In-memory client-side cache for postal lookups
 */
const pincodeLookupCache = new Map();

/**
 * Resolves a 6-digit Indian Pincode to State, District/City, and Distance from Origin
 */
export async function resolvePincodeGeocode(pincode, originLat = 18.5204, originLng = 73.8567) {
  const cleanPin = String(pincode || '').replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) {
    return { valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' };
  }

  // Check cache first
  if (pincodeLookupCache.has(cleanPin)) {
    return pincodeLookupCache.get(cleanPin);
  }

  const prefix3 = cleanPin.slice(0, 3);
  const prefix2 = cleanPin.slice(0, 2);

  // 1. Built-in known prefix lookup
  let resolvedInfo = PINCODE_PREFIX_COORDINATES[prefix3];

  // 2. If not found in 3-digit prefix, check general state by 2-digit prefix
  if (!resolvedInfo) {
    const isMaharashtra = ['40', '41', '42', '43', '44'].includes(prefix2);
    const stateName = isMaharashtra ? 'Maharashtra' : 'Interstate';
    const approxDist = isMaharashtra ? 180 : 850;

    resolvedInfo = {
      lat: isMaharashtra ? 19.5 : 23.0,
      lng: isMaharashtra ? 75.0 : 78.0,
      city: isMaharashtra ? 'Maharashtra Region' : 'National Destination',
      state: stateName,
      approxDist,
    };
  }

  let distanceKm = resolvedInfo.approxDist
    ? resolvedInfo.approxDist
    : calculateHaversineDistance(originLat, originLng, resolvedInfo.lat, resolvedInfo.lng);

  // 3. Optional async public API enrichment for pinpoint city/district name
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: AbortSignal.timeout(2000), // 2-second timeout to maintain fast UI
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const state = po.State || resolvedInfo.state;
        const district = po.District || po.Name || resolvedInfo.city;

        // If district is Pune
        const isPuneDistrict = district.toLowerCase().includes('pune') || cleanPin.startsWith('411') || cleanPin.startsWith('412');
        if (isPuneDistrict) {
          distanceKm = Math.min(distanceKm, 35);
        }

        const result = {
          valid: true,
          pincode: cleanPin,
          city: district,
          state: state,
          isMaharashtra: state.toLowerCase() === 'maharashtra',
          distanceKm,
        };
        pincodeLookupCache.set(cleanPin, result);
        return result;
      }
    }
  } catch (_) {
    // Fallback to built-in table if offline or network slow
  }

  const result = {
    valid: true,
    pincode: cleanPin,
    city: resolvedInfo.city,
    state: resolvedInfo.state,
    isMaharashtra: resolvedInfo.state.toLowerCase() === 'maharashtra',
    distanceKm,
  };

  pincodeLookupCache.set(cleanPin, result);
  return result;
}

/**
 * Evaluates the exact shipping fee based on distance, state, and custom settings
 */
export async function calculateDeliveryFee(
  pincode,
  subtotal = 0,
  customSettings = DEFAULT_DELIVERY_SETTINGS
) {
  const settings = { ...DEFAULT_DELIVERY_SETTINGS, ...customSettings };
  const originLat = Number(settings.origin_lat || 18.5204);
  const originLng = Number(settings.origin_lng || 73.8567);
  const originState = (settings.origin_state || 'Maharashtra').toLowerCase();

  const geo = await resolvePincodeGeocode(pincode, originLat, originLng);
  if (!geo.valid) {
    return {
      valid: false,
      message: geo.message || 'Invalid PIN code',
      fee: Number(settings.interstate_fee || 150),
      tierName: 'Standard Shipping',
      estimatedDays: '3-5 Business Days',
      isFree: false,
    };
  }

  const isFreeEligible =
    Boolean(settings.is_free_shipping_enabled) &&
    Number(subtotal) >= Number(settings.free_shipping_threshold || 5000);

  const isInterstate = geo.state.toLowerCase() !== originState;
  const distance = geo.distanceKm;

  let baseTierFee = Number(settings.interstate_fee || 150);
  let tierName = 'Interstate Express';
  let estimatedDays = '3-5 Business Days';

  if (!isInterstate) {
    // Within Maharashtra
    if (distance <= Number(settings.tier_1_max_km || 50)) {
      baseTierFee = Number(settings.tier_1_fee || 50);
      tierName = `Tier 1: ${settings.origin_city || 'Pune'} Local (≤ ${settings.tier_1_max_km} km)`;
      estimatedDays = '1-2 Business Days';
    } else if (distance <= Number(settings.tier_2_max_km || 150)) {
      baseTierFee = Number(settings.tier_2_fee || 100);
      tierName = `Tier 2: Maharashtra Regional (≤ ${settings.tier_2_max_km} km)`;
      estimatedDays = '2-3 Business Days';
    } else {
      // Over Tier 2 limit within state
      baseTierFee = Number(settings.interstate_fee || 150);
      tierName = `Maharashtra Outer Region (${distance} km)`;
      estimatedDays = '3-4 Business Days';
    }
  } else {
    // Interstate outside origin state
    baseTierFee = Number(settings.interstate_fee || 150);
    tierName = `Interstate: ${geo.state}`;
    estimatedDays = '3-5 Business Days';
  }

  const finalFee = isFreeEligible ? 0 : baseTierFee;

  return {
    valid: true,
    pincode: geo.pincode,
    city: geo.city,
    state: geo.state,
    distanceKm: distance,
    isInterstate,
    tierName,
    estimatedDays,
    baseFee: baseTierFee,
    fee: finalFee,
    isFree: isFreeEligible,
    freeThreshold: Number(settings.free_shipping_threshold || 5000),
  };
}
