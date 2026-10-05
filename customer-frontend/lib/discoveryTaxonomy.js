/**
 * ============================================================================
 * SUMUK CRYSTALZ 5 — 6-PILLAR DISCOVERY TAXONOMY & STOREFRONT FILTERS
 * ============================================================================
 * Defines the canonical multi-discovery structure for both Admin tagging
 * and Customer storefront navigation, filter drawers, tickers, and product cards.
 */

export const DISCOVERY_PILLARS = [
  {
    id: 'purpose',
    name: '1. Shop by Purpose',
    shortName: 'Purpose',
    subtitle: 'What do you want support with?',
    icon: 'Sparkles',
    badgeColor: 'from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-500/30',
    type: 'purpose',
    options: [
      { id: 'purpose:love-relationships', label: 'Love & Relationships', value: 'love-relationships', count: 26 },
      { id: 'purpose:money-abundance', label: 'Money & Abundance', value: 'money-abundance', count: 34 },
      { id: 'purpose:protection', label: 'Protection & Shielding', value: 'protection', count: 28 },
      { id: 'purpose:peace-relaxation', label: 'Peace & Relaxation', value: 'peace-relaxation', count: 18 },
      { id: 'purpose:focus-studies', label: 'Focus & Studies', value: 'focus-studies', count: 14 },
      { id: 'purpose:confidence', label: 'Confidence', value: 'confidence', count: 16 },
      { id: 'purpose:career-business', label: 'Career & Business', value: 'career-business', count: 22 },
      { id: 'purpose:manifestation', label: 'Manifestation', value: 'manifestation', count: 20 },
      { id: 'purpose:spiritual-growth', label: 'Spiritual Growth', value: 'spiritual-growth', count: 25 },
      { id: 'purpose:healing-wellness', label: 'Healing & Wellness', value: 'healing-wellness', count: 30 },
    ],
  },
  {
    id: 'energy_system',
    name: '2. Shop by Energy System',
    shortName: 'Energy System',
    subtitle: '7 Chakras, Zodiac, Numbers, Planetary, Aura & Vastu',
    icon: 'Zap',
    badgeColor: 'from-purple-500/20 to-indigo-600/10 text-purple-300 border-purple-500/30',
    type: 'energy',
    options: [
      { id: 'energy:7-chakras', label: '7 Chakras Alignment', value: '7-chakras', count: 42, subGroup: 'Chakras' },
      { id: 'energy:chakra-root', label: 'Root Chakra (Muladhara)', value: 'chakra-root', count: 15, subGroup: 'Chakras' },
      { id: 'energy:chakra-sacral', label: 'Sacral Chakra (Svadhishthana)', value: 'chakra-sacral', count: 12, subGroup: 'Chakras' },
      { id: 'energy:chakra-solar-plexus', label: 'Solar Plexus (Manipura)', value: 'chakra-solar-plexus', count: 20, subGroup: 'Chakras' },
      { id: 'energy:chakra-heart', label: 'Heart Chakra (Anahata)', value: 'chakra-heart', count: 24, subGroup: 'Chakras' },
      { id: 'energy:chakra-throat', label: 'Throat Chakra (Vishuddha)', value: 'chakra-throat', count: 11, subGroup: 'Chakras' },
      { id: 'energy:chakra-third-eye', label: 'Third Eye Chakra (Ajna)', value: 'chakra-third-eye', count: 19, subGroup: 'Chakras' },
      { id: 'energy:chakra-crown', label: 'Crown Chakra (Sahasrara)', value: 'chakra-crown', count: 28, subGroup: 'Chakras' },
      { id: 'energy:zodiac', label: 'Zodiac / Astrology', value: 'zodiac', count: 38, subGroup: 'Zodiac' },
      { id: 'energy:numerology', label: 'Numerology / Numbers', value: 'numerology', count: 18, subGroup: 'Numerology' },
      { id: 'energy:planetary', label: 'Planetary Energy', value: 'planetary', count: 16, subGroup: 'Planetary' },
      { id: 'energy:aura-energy', label: 'Aura & Energy Shield', value: 'aura-energy', count: 22, subGroup: 'Aura' },
      { id: 'energy:vastu', label: 'Vastu Remedy (Spiritual)', value: 'vastu', count: 26, subGroup: 'Vastu' },
    ],
  },
  {
    id: 'crystal_specimen',
    name: '3. Shop by Crystal / Specimen',
    shortName: 'Crystal / Specimen',
    subtitle: 'Raw stones, tumbles, towers, spheres and collector geodes',
    icon: 'Layers',
    badgeColor: 'from-amber-400/20 to-yellow-600/10 text-amber-200 border-amber-400/30',
    type: 'specimen',
    options: [
      { id: 'specimen:raw-stones', label: 'Raw Stones', value: 'raw-stones', count: 19 },
      { id: 'specimen:tumbles', label: 'Tumbles', value: 'tumbles', count: 27 },
      { id: 'specimen:towers-points', label: 'Towers & Points', value: 'towers-points', count: 21 },
      { id: 'specimen:pyramids', label: 'Pyramids', value: 'pyramids', count: 18 },
      { id: 'specimen:spheres', label: 'Spheres', value: 'spheres', count: 15 },
      { id: 'specimen:clusters-geodes', label: 'Clusters & Geodes', value: 'clusters-geodes', count: 14 },
      { id: 'specimen:crystal-trees', label: 'Crystal Trees', value: 'crystal-trees', count: 12 },
      { id: 'specimen:crystal-chips', label: 'Crystal Chips', value: 'crystal-chips', count: 10 },
      { id: 'specimen:gemstone-specimens', label: 'Gemstone Specimens', value: 'gemstone-specimens', count: 32 },
      { id: 'specimen:rare-collector', label: 'Rare / Collector Crystals', value: 'rare-collector', count: 8 },
    ],
  },
  {
    id: 'jewellery',
    name: '4. Shop by Jewellery',
    shortName: 'Jewellery',
    subtitle: 'Sacred wearable crystal bracelets, malas and pendants',
    icon: 'Crown',
    badgeColor: 'from-rose-500/20 to-pink-600/10 text-rose-300 border-rose-500/30',
    type: 'jewellery',
    options: [
      { id: 'jewellery:bracelets', label: 'Bracelets', value: 'bracelets', count: 48 },
      { id: 'jewellery:malas', label: 'Malas', value: 'malas', count: 16 },
      { id: 'jewellery:necklaces', label: 'Necklaces', value: 'necklaces', count: 14 },
      { id: 'jewellery:pendants', label: 'Pendants', value: 'pendants', count: 24 },
      { id: 'jewellery:rings', label: 'Rings', value: 'rings', count: 11 },
      { id: 'jewellery:earrings', label: 'Earrings', value: 'earrings', count: 9 },
      { id: 'jewellery:beads', label: 'Beads', value: 'beads', count: 15 },
      { id: 'jewellery:custom-jewellery', label: 'Custom Jewellery', value: 'custom-jewellery', count: 7 },
    ],
  },
  {
    id: 'bead_size',
    name: '5. Shop by Bead Size',
    shortName: 'Bead Size',
    subtitle: '4mm, 6mm, 8mm, 10mm, 12mm+ and custom sizes',
    icon: 'Tag',
    badgeColor: 'from-emerald-500/20 to-teal-600/10 text-emerald-300 border-emerald-500/30',
    type: 'size',
    options: [
      { id: 'bead:4mm', label: '4 mm', value: '4mm', count: 12 },
      { id: 'bead:6mm', label: '6 mm', value: '6mm', count: 28 },
      { id: 'bead:8mm', label: '8 mm', value: '8mm', count: 52 },
      { id: 'bead:10mm', label: '10 mm', value: '10mm', count: 24 },
      { id: 'bead:12mm-plus', label: '12 mm+', value: '12mm-plus', count: 14 },
      { id: 'bead:custom-size', label: 'Custom Size', value: 'custom-size', count: 6 },
    ],
  },
  {
    id: 'home_space',
    name: '6. Shop for Home & Space',
    shortName: 'Home & Space',
    subtitle: 'Home Décor + Vastu Crystals together for aesthetic & energetic harmony',
    icon: 'Sparkles',
    badgeColor: 'from-amber-600/20 to-orange-600/10 text-amber-300 border-amber-600/30',
    type: 'home',
    options: [
      { id: 'home:vastu-crystals', label: 'Vastu Crystals', value: 'vastu-crystals', count: 26 },
      { id: 'home:crystal-trees', label: 'Crystal Trees', value: 'crystal-trees', count: 14 },
      { id: 'home:crystal-pyramids', label: 'Crystal Pyramids', value: 'crystal-pyramids', count: 18 },
      { id: 'home:selenite-decor', label: 'Selenite Décor', value: 'selenite-decor', count: 16 },
      { id: 'home:clusters-geodes', label: 'Crystal Geodes & Clusters', value: 'clusters-geodes', count: 15 },
      { id: 'home:crystal-spheres', label: 'Crystal Spheres', value: 'crystal-spheres', count: 12 },
      { id: 'home:crystal-idols', label: 'Crystal Idols', value: 'crystal-idols', count: 9 },
      { id: 'home:evil-eye-hangings', label: 'Evil-Eye / Protection Hangings', value: 'evil-eye-hangings', count: 18 },
      { id: 'home:desk-office', label: 'Desk & Office Décor', value: 'desk-office', count: 20 },
      { id: 'home:meditation-decor', label: 'Meditation / Spiritual Décor', value: 'meditation-decor', count: 22 },
      { id: 'home:gift-decor', label: 'Gift & Décor Pieces', value: 'gift-decor', count: 25 },
    ],
  },
];

/**
 * Top Navigation Megamenu Structure for Storefront Header
 */
export const TOP_NAV_SHOP_MENU = [
  { label: 'By Purpose', href: '/shop?pillar=purpose', description: 'Love, Wealth, Protection, Peace & Growth' },
  { label: 'By Chakra', href: '/shop?pillar=energy_system&filter=energy:7-chakras', description: '7 Sacred Chakras Alignment' },
  { label: 'By Zodiac', href: '/shop?pillar=energy_system&filter=energy:zodiac', description: 'Astrological Sun & Moon Crystals' },
  { label: 'By Numbers', href: '/shop?pillar=energy_system&filter=energy:numerology', description: 'Numerology & Birth Path stones' },
  { label: 'By Vastu', href: '/shop?pillar=energy_system&filter=energy:vastu', description: 'Spatial Harmony & Energy Remedies' },
  { label: 'By Crystal/Specimen', href: '/shop?pillar=crystal_specimen', description: 'Raw Stones, Tumbles, Towers & Geodes' },
  { label: 'Jewellery', href: '/shop?pillar=jewellery', description: 'Bracelets, Malas, Pendants & Rings' },
  { label: 'Bead Size', href: '/shop?pillar=bead_size', description: '4mm, 6mm, 8mm, 10mm & 12mm+' },
  { label: 'Home & Space', href: '/shop?pillar=home_space', description: 'Vastu Décor, Trees, Idols & Selenite' },
  { label: 'Gifts', href: '/shop?filter=home:gift-decor', description: 'Consecrated Spiritual Gift Sets' },
  { label: 'New Arrivals', href: '/shop?sort=new_arrival', description: 'Recently Consecrated Masterworks' },
];

/**
 * Lookup table for fast label resolution
 */
const LABEL_MAP = {};
DISCOVERY_PILLARS.forEach((pillar) => {
  pillar.options.forEach((opt) => {
    LABEL_MAP[opt.id] = opt.label;
    LABEL_MAP[opt.value] = opt.label;
  });
});

// Additional aliases
LABEL_MAP['wealth'] = 'Money & Abundance';
LABEL_MAP['love'] = 'Love & Relationships';
LABEL_MAP['protection'] = 'Protection';
LABEL_MAP['peace'] = 'Peace & Relaxation';
LABEL_MAP['career'] = 'Career & Business';
LABEL_MAP['spiritual'] = 'Spiritual Growth';
LABEL_MAP['chakra-solar-plexus'] = 'Solar Plexus';
LABEL_MAP['chakra-heart'] = 'Heart Chakra';
LABEL_MAP['chakra-crown'] = 'Crown Chakra';
LABEL_MAP['chakra-third-eye'] = 'Third Eye';
LABEL_MAP['chakra-root'] = 'Root Chakra';
LABEL_MAP['chakra-throat'] = 'Throat Chakra';
LABEL_MAP['chakra-sacral'] = 'Sacral Chakra';

/**
 * Get human-readable label from any filter tag ID or value
 */
export function getFilterLabel(filterIdOrValue) {
  if (!filterIdOrValue) return '';
  if (LABEL_MAP[filterIdOrValue]) return LABEL_MAP[filterIdOrValue];

  // Strip prefix if any (e.g. "purpose:money-abundance" -> "Money & Abundance")
  const stripped = filterIdOrValue.includes(':')
    ? filterIdOrValue.split(':')[1]
    : filterIdOrValue;

  if (LABEL_MAP[stripped]) return LABEL_MAP[stripped];

  // Capitalize hyphenated strings as fallback
  return stripped
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * Formats a clean list of multi-discovery tags for display underneath product cards.
 * Example return: ['Money & Abundance', 'Solar Plexus', 'Leo', '8mm', 'Bracelet']
 */
export function formatProductMultiTags(product, maxTags = 5) {
  if (!product) return [];
  const tags = [];

  // 1. Check assigned dynamic filters first
  const assigned = Array.isArray(product.assignedFilters)
    ? product.assignedFilters
    : (Array.isArray(product.assigned_filters) ? product.assigned_filters : (Array.isArray(product.tags) ? product.tags : []));

  if (assigned.length > 0) {
    assigned.forEach((f) => {
      const lbl = getFilterLabel(f);
      if (lbl && !tags.includes(lbl)) {
        tags.push(lbl);
      }
    });
  }

  // 2. Purpose / Intention
  if (product.purpose && product.purpose !== 'all') {
    const pLbl = getFilterLabel(product.purpose) || product.purposeLabel;
    if (pLbl && !tags.includes(pLbl)) tags.push(pLbl);
  }

  // 3. Chakra
  if (product.chakra) {
    const chk = Array.isArray(product.chakra) ? product.chakra[0] : String(product.chakra).split('&')[0]?.trim();
    if (chk && !tags.includes(chk)) tags.push(chk);
  }

  // 4. Zodiac
  if (product.zodiac) {
    const zod = product.zodiac.split(',')[0]?.trim();
    if (zod && !tags.includes(zod)) tags.push(zod);
  }

  // 5. Bead Size
  if (product.beadSize || product.bead_size) {
    const bs = (product.beadSize || product.bead_size).split(' ')[0];
    if (bs && !tags.includes(bs)) tags.push(bs);
  }

  // 6. Jewellery / Specimen Category
  if (product.category) {
    const cat = product.category.replace('Energy Bands', 'Bracelet').replace('Sacred Malas', 'Mala');
    if (cat && !tags.includes(cat)) tags.push(cat);
  }

  // 7. Crystal Type
  if (product.crystalType || product.crystal_type) {
    const ct = product.crystalType || product.crystal_type;
    if (ct && !tags.includes(ct)) tags.push(ct);
  }

  // Return up to maxTags deduplicated
  return tags.slice(0, maxTags);
}

/**
 * Checks if a product matches selected discovery filters
 */
export function productMatchesFilters(product, activeFilters = []) {
  if (!activeFilters || activeFilters.length === 0) return true;
  if (!product) return false;

  const assigned = Array.isArray(product.assignedFilters)
    ? product.assignedFilters
    : (Array.isArray(product.assigned_filters) ? product.assigned_filters : (Array.isArray(product.tags) ? product.tags : []));

  const textToSearch = [
    product.name || '',
    product.title || '',
    product.description || '',
    product.shortDescription || product.short_description || '',
    product.category || '',
    product.collection || '',
    product.crystalType || product.crystal_type || '',
    product.beadType || '',
    product.beadSize || product.bead_size || '',
    product.zodiac || '',
    Array.isArray(product.chakra) ? product.chakra.join(' ') : (product.chakra || ''),
    product.purpose || '',
    product.purposeLabel || '',
    ...assigned,
  ].join(' ').toLowerCase();

  return activeFilters.some((f) => {
    const fLow = f.toLowerCase();
    const stripped = fLow.includes(':') ? fLow.split(':')[1] : fLow;
    return textToSearch.includes(fLow) || textToSearch.includes(stripped.replace(/-/g, ' '));
  });
}
