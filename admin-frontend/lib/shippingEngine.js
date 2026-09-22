/**
 * =========================================================================
 * SUMUK CRYSTALZ 5 • DYNAMIC PINCODE & DISTANCE-BASED SHIPPING ENGINE (ADMIN)
 * =========================================================================
 * Origin: Pune, Maharashtra (18.5204° N, 73.8567° E)
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
