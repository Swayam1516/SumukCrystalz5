/**
 * ============================================================================
 * SUMUK CRYSTALZ 5 — ADVANCED MULTI-DIMENSIONAL PRODUCT DISCOVERY TAXONOMY
 * ============================================================================
 * Complete 6-Pillar discovery framework for both Admin catalog management
 * and Customer storefront navigation, multi-filter engine, and URL sync.
 */

export const DISCOVERY_PILLARS = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. SHOP BY PURPOSE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'purpose',
    name: 'Shop by Purpose',
    shortName: 'Purpose',
    subtitle: 'What would you like to invite into your life?',
    icon: 'Sparkles',
    badgeColor: 'from-amber-500/20 to-amber-600/10 text-amber-300 border-amber-500/30',
    options: [
      { id: 'purpose:love-relationships', label: 'Love & Relationships', value: 'love-relationships' },
      { id: 'purpose:money-abundance', label: 'Money & Abundance', value: 'money-abundance' },
      { id: 'purpose:protection', label: 'Protection', value: 'protection' },
      { id: 'purpose:peace-relaxation', label: 'Peace & Relaxation', value: 'peace-relaxation' },
      { id: 'purpose:focus-studies', label: 'Focus & Studies', value: 'focus-studies' },
      { id: 'purpose:confidence', label: 'Confidence', value: 'confidence' },
      { id: 'purpose:career-business', label: 'Career & Business', value: 'career-business' },
      { id: 'purpose:manifestation', label: 'Manifestation', value: 'manifestation' },
      { id: 'purpose:spiritual-growth', label: 'Spiritual Growth', value: 'spiritual-growth' },
      { id: 'purpose:healing-wellness', label: 'Healing & Wellness', value: 'healing-wellness' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. SHOP BY ENERGY SYSTEM
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'energy_system',
    name: 'Shop by Energy System',
    shortName: 'Energy System',
    subtitle: 'Discover crystals through your energy and spiritual preferences.',
    icon: 'Zap',
    badgeColor: 'from-purple-500/20 to-indigo-600/10 text-purple-300 border-purple-500/30',
    subGroups: [
      {
        id: 'chakras',
        title: '7 Chakras',
        options: [
          { id: 'energy:root-chakra', label: 'Root Chakra', value: 'root-chakra', subGroup: '7 Chakras' },
          { id: 'energy:sacral-chakra', label: 'Sacral Chakra', value: 'sacral-chakra', subGroup: '7 Chakras' },
          { id: 'energy:solar-plexus-chakra', label: 'Solar Plexus Chakra', value: 'solar-plexus-chakra', subGroup: '7 Chakras' },
          { id: 'energy:heart-chakra', label: 'Heart Chakra', value: 'heart-chakra', subGroup: '7 Chakras' },
          { id: 'energy:throat-chakra', label: 'Throat Chakra', value: 'throat-chakra', subGroup: '7 Chakras' },
          { id: 'energy:third-eye-chakra', label: 'Third Eye Chakra', value: 'third-eye-chakra', subGroup: '7 Chakras' },
          { id: 'energy:crown-chakra', label: 'Crown Chakra', value: 'crown-chakra', subGroup: '7 Chakras' },
        ],
      },
      {
        id: 'zodiac',
        title: 'Zodiac',
        options: [
          { id: 'energy:zodiac-aries', label: 'Aries', value: 'zodiac-aries', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-taurus', label: 'Taurus', value: 'zodiac-taurus', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-gemini', label: 'Gemini', value: 'zodiac-gemini', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-cancer', label: 'Cancer', value: 'zodiac-cancer', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-leo', label: 'Leo', value: 'zodiac-leo', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-virgo', label: 'Virgo', value: 'zodiac-virgo', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-libra', label: 'Libra', value: 'zodiac-libra', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-scorpio', label: 'Scorpio', value: 'zodiac-scorpio', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-sagittarius', label: 'Sagittarius', value: 'zodiac-sagittarius', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-capricorn', label: 'Capricorn', value: 'zodiac-capricorn', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-aquarius', label: 'Aquarius', value: 'zodiac-aquarius', subGroup: 'Zodiac' },
          { id: 'energy:zodiac-pisces', label: 'Pisces', value: 'zodiac-pisces', subGroup: 'Zodiac' },
        ],
      },
      {
        id: 'numerology',
        title: 'Numerology / Numbers',
        options: [
          { id: 'energy:num-1', label: 'Life Path 1', value: 'num-1', subGroup: 'Numerology' },
          { id: 'energy:num-2', label: 'Life Path 2', value: 'num-2', subGroup: 'Numerology' },
          { id: 'energy:num-3', label: 'Life Path 3', value: 'num-3', subGroup: 'Numerology' },
          { id: 'energy:num-4', label: 'Life Path 4', value: 'num-4', subGroup: 'Numerology' },
          { id: 'energy:num-5', label: 'Life Path 5', value: 'num-5', subGroup: 'Numerology' },
          { id: 'energy:num-6', label: 'Life Path 6', value: 'num-6', subGroup: 'Numerology' },
          { id: 'energy:num-7', label: 'Life Path 7', value: 'num-7', subGroup: 'Numerology' },
          { id: 'energy:num-8', label: 'Life Path 8', value: 'num-8', subGroup: 'Numerology' },
          { id: 'energy:num-9', label: 'Life Path 9', value: 'num-9', subGroup: 'Numerology' },
          { id: 'energy:num-11', label: 'Master Number 11', value: 'num-11', subGroup: 'Numerology' },
          { id: 'energy:num-22', label: 'Master Number 22', value: 'num-22', subGroup: 'Numerology' },
          { id: 'energy:num-33', label: 'Master Number 33', value: 'num-33', subGroup: 'Numerology' },
        ],
      },
      {
        id: 'planetary',
        title: 'Planetary',
        options: [
          { id: 'energy:planet-sun', label: 'Sun', value: 'planet-sun', subGroup: 'Planetary' },
          { id: 'energy:planet-moon', label: 'Moon', value: 'planet-moon', subGroup: 'Planetary' },
          { id: 'energy:planet-mars', label: 'Mars', value: 'planet-mars', subGroup: 'Planetary' },
          { id: 'energy:planet-mercury', label: 'Mercury', value: 'planet-mercury', subGroup: 'Planetary' },
          { id: 'energy:planet-jupiter', label: 'Jupiter', value: 'planet-jupiter', subGroup: 'Planetary' },
          { id: 'energy:planet-venus', label: 'Venus', value: 'planet-venus', subGroup: 'Planetary' },
          { id: 'energy:planet-saturn', label: 'Saturn', value: 'planet-saturn', subGroup: 'Planetary' },
          { id: 'energy:planet-rahu', label: 'Rahu', value: 'planet-rahu', subGroup: 'Planetary' },
          { id: 'energy:planet-ketu', label: 'Ketu', value: 'planet-ketu', subGroup: 'Planetary' },
        ],
      },
      {
        id: 'aura_energy',
        title: 'Aura & Energy',
        options: [
          { id: 'energy:aura-cleansing', label: 'Aura Cleansing', value: 'aura-cleansing', subGroup: 'Aura & Energy' },
          { id: 'energy:energy-balance', label: 'Energy Balance', value: 'energy-balance', subGroup: 'Aura & Energy' },
          { id: 'energy:positive-energy', label: 'Positive Energy', value: 'positive-energy', subGroup: 'Aura & Energy' },
          { id: 'energy:grounding', label: 'Grounding', value: 'grounding', subGroup: 'Aura & Energy' },
          { id: 'energy:spiritual-protection', label: 'Spiritual Protection', value: 'spiritual-protection', subGroup: 'Aura & Energy' },
          { id: 'energy:meditation', label: 'Meditation', value: 'meditation', subGroup: 'Aura & Energy' },
        ],
      },
      {
        id: 'vastu',
        title: 'Vastu',
        options: [
          { id: 'energy:vastu-north', label: 'North Direction', value: 'vastu-north', subGroup: 'Vastu' },
          { id: 'energy:vastu-south', label: 'South Direction', value: 'vastu-south', subGroup: 'Vastu' },
          { id: 'energy:vastu-east', label: 'East Direction', value: 'vastu-east', subGroup: 'Vastu' },
          { id: 'energy:vastu-west', label: 'West Direction', value: 'vastu-west', subGroup: 'Vastu' },
          { id: 'energy:vastu-north-east', label: 'North-East', value: 'vastu-north-east', subGroup: 'Vastu' },
          { id: 'energy:vastu-north-west', label: 'North-West', value: 'vastu-north-west', subGroup: 'Vastu' },
          { id: 'energy:vastu-south-east', label: 'South-East', value: 'vastu-south-east', subGroup: 'Vastu' },
          { id: 'energy:vastu-south-west', label: 'South-West', value: 'vastu-south-west', subGroup: 'Vastu' },
          { id: 'energy:vastu-brahmasthan', label: 'Centre / Brahmasthan', value: 'vastu-brahmasthan', subGroup: 'Vastu' },
        ],
      },
    ],
    // Flat options list for easy iteration
    get options() {
      return this.subGroups.flatMap((sg) => sg.options);
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. SHOP BY CRYSTAL / SPECIMEN
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'crystal_specimen',
    name: 'Shop by Crystal / Specimen',
    shortName: 'Crystal / Specimen',
    subtitle: 'Find your crystal by physical form or mineral identity.',
    icon: 'Layers',
    badgeColor: 'from-amber-400/20 to-yellow-600/10 text-amber-200 border-amber-400/30',
    subGroups: [
      {
        id: 'specimen_forms',
        title: 'Specimen Forms',
        options: [
          { id: 'specimen:raw-stones', label: 'Raw Stones & Geodes', value: 'raw-stones', subGroup: 'Specimen Forms' },
          { id: 'specimen:crystal-clusters', label: 'Crystal Clusters', value: 'crystal-clusters', subGroup: 'Specimen Forms' },
          { id: 'specimen:towers-points', label: 'Crystal Towers & Points', value: 'towers-points', subGroup: 'Specimen Forms' },
          { id: 'specimen:tumbled-stones', label: 'Tumbled Stones', value: 'tumbled-stones', subGroup: 'Specimen Forms' },
          { id: 'specimen:spheres-orbs', label: 'Spheres & Orbs', value: 'spheres-orbs', subGroup: 'Specimen Forms' },
          { id: 'specimen:pyramids', label: 'Pyramids', value: 'pyramids', subGroup: 'Specimen Forms' },
          { id: 'specimen:crystal-wands', label: 'Crystal Wands', value: 'crystal-wands', subGroup: 'Specimen Forms' },
          { id: 'specimen:worry-palm-stones', label: 'Worry Stones & Palm Stones', value: 'worry-palm-stones', subGroup: 'Specimen Forms' },
          { id: 'specimen:healing-pencils', label: 'Healing Pencils', value: 'healing-pencils', subGroup: 'Specimen Forms' },
          { id: 'specimen:carved-figurines', label: 'Carved & Sacred Figurines', value: 'carved-figurines', subGroup: 'Specimen Forms' },
        ],
      },
      {
        id: 'crystal_identities',
        title: 'Crystal Identities',
        options: [
          { id: 'crystal:pyrite', label: 'Pyrite', value: 'pyrite', subGroup: 'Crystal Identities' },
          { id: 'crystal:amethyst', label: 'Amethyst', value: 'amethyst', subGroup: 'Crystal Identities' },
          { id: 'crystal:clear-quartz', label: 'Clear Quartz', value: 'clear-quartz', subGroup: 'Crystal Identities' },
          { id: 'crystal:rose-quartz', label: 'Rose Quartz', value: 'rose-quartz', subGroup: 'Crystal Identities' },
          { id: 'crystal:citrine', label: 'Citrine', value: 'citrine', subGroup: 'Crystal Identities' },
          { id: 'crystal:black-tourmaline', label: 'Black Tourmaline', value: 'black-tourmaline', subGroup: 'Crystal Identities' },
          { id: 'crystal:tigers-eye', label: "Tiger's Eye", value: 'tigers-eye', subGroup: 'Crystal Identities' },
          { id: 'crystal:green-jade', label: 'Green Jade', value: 'green-jade', subGroup: 'Crystal Identities' },
          { id: 'crystal:selenite', label: 'Selenite', value: 'selenite', subGroup: 'Crystal Identities' },
          { id: 'crystal:carnelian', label: 'Carnelian', value: 'carnelian', subGroup: 'Crystal Identities' },
          { id: 'crystal:labradorite', label: 'Labradorite', value: 'labradorite', subGroup: 'Crystal Identities' },
          { id: 'crystal:fluorite', label: 'Fluorite', value: 'fluorite', subGroup: 'Crystal Identities' },
          { id: 'crystal:obsidian', label: 'Obsidian', value: 'obsidian', subGroup: 'Crystal Identities' },
          { id: 'crystal:moonstone', label: 'Moonstone', value: 'moonstone', subGroup: 'Crystal Identities' },
          { id: 'crystal:lapis-lazuli', label: 'Lapis Lazuli', value: 'lapis-lazuli', subGroup: 'Crystal Identities' },
          { id: 'crystal:red-jasper', label: 'Red Jasper', value: 'red-jasper', subGroup: 'Crystal Identities' },
          { id: 'crystal:malachite', label: 'Malachite', value: 'malachite', subGroup: 'Crystal Identities' },
          { id: 'crystal:sodalite', label: 'Sodalite', value: 'sodalite', subGroup: 'Crystal Identities' },
        ],
      },
    ],
    get options() {
      return this.subGroups.flatMap((sg) => sg.options);
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SHOP BY JEWELLERY
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'jewellery',
    name: 'Shop by Jewellery',
    shortName: 'Jewellery',
    subtitle: 'Sacred crystal jewellery crafted for everyday wear.',
    icon: 'Crown',
    badgeColor: 'from-rose-500/20 to-pink-600/10 text-rose-300 border-rose-500/30',
    options: [
      { id: 'jewellery:bracelets', label: 'Bracelets', value: 'bracelets' },
      { id: 'jewellery:malas', label: 'Malas', value: 'malas' },
      { id: 'jewellery:necklaces', label: 'Necklaces', value: 'necklaces' },
      { id: 'jewellery:pendants', label: 'Pendants', value: 'pendants' },
      { id: 'jewellery:rings', label: 'Rings', value: 'rings' },
      { id: 'jewellery:earrings', label: 'Earrings', value: 'earrings' },
      { id: 'jewellery:beads', label: 'Beads', value: 'beads' },
      { id: 'jewellery:custom-jewellery', label: 'Custom Jewellery', value: 'custom-jewellery' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SHOP BY BEAD SIZE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'bead_size',
    name: 'Shop by Bead Size',
    shortName: 'Bead Size',
    subtitle: 'Choose the exact bead size for your wrist and energy practice.',
    icon: 'Tag',
    badgeColor: 'from-emerald-500/20 to-teal-600/10 text-emerald-300 border-emerald-500/30',
    options: [
      { id: 'bead:4mm', label: '4 mm', value: '4mm' },
      { id: 'bead:6mm', label: '6 mm', value: '6mm' },
      { id: 'bead:8mm', label: '8 mm', value: '8mm' },
      { id: 'bead:10mm', label: '10 mm', value: '10mm' },
      { id: 'bead:12mm-plus', label: '12 mm+', value: '12mm-plus' },
      { id: 'bead:custom-size', label: 'Custom Size', value: 'custom-size' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SHOP FOR HOME & SPACE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'home_space',
    name: 'Shop for Home & Space',
    shortName: 'Home & Space',
    subtitle: 'Bring balanced energy and beauty into your living spaces.',
    icon: 'Home',
    badgeColor: 'from-amber-600/20 to-orange-600/10 text-amber-300 border-amber-600/30',
    options: [
      { id: 'home:vastu-crystals', label: 'Vastu Crystals', value: 'vastu-crystals' },
      { id: 'home:crystal-trees', label: 'Crystal Trees', value: 'crystal-trees' },
      { id: 'home:crystal-pyramids', label: 'Crystal Pyramids', value: 'crystal-pyramids' },
      { id: 'home:water-fountains', label: 'Water Fountains & Water Crystal Accents', value: 'water-fountains' },
      { id: 'home:sacred-geometry-plates', label: 'Sacred Geometry Plates & Grids', value: 'sacred-geometry-plates' },
      { id: 'home:raw-geodes-office', label: 'Raw Geodes for Living Room & Office', value: 'raw-geodes-office' },
      { id: 'home:feng-shui', label: 'Feng Shui Crystals', value: 'feng-shui' },
      { id: 'home:desk-workspace', label: 'Desk & Workspace Crystals', value: 'desk-workspace' },
      { id: 'home:bedroom-harmonizing', label: 'Bedroom Harmonizing Crystals', value: 'bedroom-harmonizing' },
      { id: 'home:temple-altar', label: 'Temple & Altar Specimens', value: 'temple-altar' },
      { id: 'home:statement-pieces', label: 'Large Statement Crystal Pieces', value: 'statement-pieces' },
    ],
  },
];

/**
 * Top Navigation Menu for Quick Jumps
 */
export const TOP_NAV_SHOP_MENU = [
  { label: 'Bracelets', href: '/shop?jewellery=bracelets', description: 'Consecrated 8mm & 10mm Crystal Bracelets' },
  { label: 'Consecrated Malas', href: '/shop?jewellery=malas', description: '108 Japa & Meditation Prayer Beads' },
  { label: 'Money & Abundance', href: '/shop?purpose=money-abundance', description: 'Pyrite, Citrine & Green Aventurine' },
  { label: '7 Chakras', href: '/shop?pillar=energy_system&filter=energy:root-chakra', description: 'Chakra Alignment & Kundalini' },
  { label: 'Crystal Trees', href: '/shop?home_space=crystal-trees', description: 'Gemstone Bonsai & Trees of Life' },
  { label: 'Towers & Points', href: '/shop?crystal_specimen=towers-points', description: 'Energy Generators & Direct Amplifiers' },
  { label: 'Raw Crystals & Geodes', href: '/shop?crystal_specimen=raw-stones', description: 'Untouched Earth Minerals' },
  { label: 'Vastu Space Décor', href: '/shop?home_space=vastu-crystals', description: 'Spatial Protection & Positive Flow' },
];

/**
 * Fast lookup map for resolving human-readable labels
 */
const LABEL_MAP = {};
DISCOVERY_PILLARS.forEach((pillar) => {
  pillar.options.forEach((opt) => {
    LABEL_MAP[opt.id] = opt.label;
    LABEL_MAP[opt.value] = opt.label;
  });
});

// Common aliases for labels
LABEL_MAP['wealth'] = 'Money & Abundance';
LABEL_MAP['love'] = 'Love & Relationships';
LABEL_MAP['protection'] = 'Protection';
LABEL_MAP['peace'] = 'Peace & Relaxation';
LABEL_MAP['career'] = 'Career & Business';
LABEL_MAP['spiritual'] = 'Spiritual Growth';
LABEL_MAP['chakra-solar-plexus'] = 'Solar Plexus Chakra';
LABEL_MAP['chakra-heart'] = 'Heart Chakra';
LABEL_MAP['chakra-crown'] = 'Crown Chakra';
LABEL_MAP['chakra-third-eye'] = 'Third Eye Chakra';
LABEL_MAP['chakra-root'] = 'Root Chakra';
LABEL_MAP['chakra-throat'] = 'Throat Chakra';
LABEL_MAP['chakra-sacral'] = 'Sacral Chakra';
LABEL_MAP['zodiac'] = 'Zodiac / Astrology';
LABEL_MAP['numerology'] = 'Numerology';
LABEL_MAP['planetary'] = 'Planetary';
LABEL_MAP['raw-stones'] = 'Raw Stones & Geodes';
LABEL_MAP['bracelets'] = 'Bracelets';
LABEL_MAP['malas'] = 'Consecrated Malas';
LABEL_MAP['8mm'] = '8 mm';
LABEL_MAP['6mm'] = '6 mm';
LABEL_MAP['10mm'] = '10 mm';

/**
 * Get human-readable label from any filter ID or slug
 */
export function getFilterLabel(filterIdOrValue) {
  if (!filterIdOrValue) return '';
  if (LABEL_MAP[filterIdOrValue]) return LABEL_MAP[filterIdOrValue];

  const stripped = filterIdOrValue.includes(':')
    ? filterIdOrValue.split(':')[1]
    : filterIdOrValue;

  if (LABEL_MAP[stripped]) return LABEL_MAP[stripped];

  return stripped
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * Determine which discovery pillar a filter ID belongs to
 */
export function getPillarForFilter(filterId) {
  if (!filterId) return null;
  if (filterId.startsWith('purpose:')) return 'purpose';
  if (filterId.startsWith('energy:')) return 'energy_system';
  if (filterId.startsWith('crystal:') || filterId.startsWith('specimen:')) return 'crystal_specimen';
  if (filterId.startsWith('jewellery:')) return 'jewellery';
  if (filterId.startsWith('bead:')) return 'bead_size';
  if (filterId.startsWith('home:')) return 'home_space';

  // Fallback scan options
  for (const pillar of DISCOVERY_PILLARS) {
    if (pillar.options.some((o) => o.id === filterId || o.value === filterId)) {
      return pillar.id;
    }
  }
  return null;
}

/**
 * Formats a clean list of multi-discovery tags for display underneath product cards.
 */
export function formatProductMultiTags(product, maxTags = 4) {
  if (!product) return [];

  const rawTags = Array.isArray(product.assigned_filters)
    ? product.assigned_filters
    : (Array.isArray(product.assignedFilters) ? product.assignedFilters : (Array.isArray(product.tags) ? product.tags : []));

  const tags = [...rawTags];

  // Infer primary tags if missing
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('bracelet') && !tags.includes('jewellery:bracelets')) tags.push('jewellery:bracelets');
  if (cat.includes('mala') && !tags.includes('jewellery:malas')) tags.push('jewellery:malas');
  if (product.crystal_type) {
    const cKey = `crystal:${product.crystal_type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (!tags.includes(cKey)) tags.push(cKey);
  }

  // Format into visual pills
  return tags.slice(0, maxTags).map((tagId) => {
    const pillarId = getPillarForFilter(tagId);
    let colorClass = 'bg-stone-800 text-stone-200 border-stone-700';

    if (pillarId === 'purpose') colorClass = 'bg-amber-500/10 text-amber-700 border-amber-300';
    else if (pillarId === 'energy_system') colorClass = 'bg-purple-500/10 text-purple-700 border-purple-300';
    else if (pillarId === 'crystal_specimen') colorClass = 'bg-yellow-500/10 text-yellow-800 border-yellow-300';
    else if (pillarId === 'jewellery') colorClass = 'bg-rose-500/10 text-rose-700 border-rose-300';
    else if (pillarId === 'bead_size') colorClass = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
    else if (pillarId === 'home_space') colorClass = 'bg-orange-500/10 text-orange-700 border-orange-300';

    return {
      id: tagId,
      label: getFilterLabel(tagId),
      pillarId,
      colorClass,
    };
  });
}

/**
 * ============================================================================
 * CORE MULTI-DIMENSIONAL FILTER MATCHING ENGINE
 * ============================================================================
 * Logic Requirements from Master Prompt:
 * 1. Multiple selections within the SAME group: OR logic.
 * 2. Selections across DIFFERENT groups: AND logic.
 * 3. Variant-level Bead Size checking: If a bead size is selected (e.g. 8 mm),
 *    the product matches if assigned_filters has 'bead:8mm' OR any variant has
 *    bead_size matching '8mm'/'8 mm'.
 * 4. Fallback inference from product metadata (category, crystal_type, chakra, zodiac).
 */
export function productMatchesDiscoveryFilters(product, selectedFilterIds = []) {
  if (!product) return false;
  if (!selectedFilterIds || selectedFilterIds.length === 0) return true;

  // Group selected filter IDs by pillar dimension
  const dimensionGroups = {};
  selectedFilterIds.forEach((filterId) => {
    const pillar = getPillarForFilter(filterId) || 'other';
    if (!dimensionGroups[pillar]) dimensionGroups[pillar] = [];
    dimensionGroups[pillar].push(filterId);
  });

  const assigned = Array.isArray(product.assigned_filters)
    ? product.assigned_filters
    : (Array.isArray(product.assignedFilters) ? product.assignedFilters : (Array.isArray(product.tags) ? product.tags : []));

  const assignedSet = new Set(assigned.map((f) => f.toLowerCase()));

  // Extract searchable attributes
  const pName = (product.name || '').toLowerCase();
  const pCategory = (product.category || '').toLowerCase();
  const pCrystal = (product.crystal_type || product.crystal || '').toLowerCase();
  const pChakra = (product.chakra || '').toLowerCase();
  const pZodiac = (product.zodiac || '').toLowerCase();
  const pDesc = (product.description || '').toLowerCase();
  const variants = Array.isArray(product.variants) ? product.variants : [];

  // Helper: test if product matches a single filter ID
  const matchesSingleFilter = (filterId) => {
    const fid = filterId.toLowerCase();
    if (fid === 'all') return true;
    if (assignedSet.has(fid)) return true;

    // Check stripped value (e.g., 'money-abundance')
    const stripped = fid.includes(':') ? fid.split(':')[1] : fid;
    if (stripped === 'all') return true;
    if (assignedSet.has(stripped)) return true;

    // 1. Purpose matching
    if (fid.startsWith('purpose:')) {
      if (stripped === 'money-abundance' && (pDesc.includes('money') || pDesc.includes('wealth') || pDesc.includes('abundance') || pDesc.includes('prosperity') || pName.includes('pyrite') || pName.includes('citrine'))) return true;
      if (stripped === 'love-relationships' && (pDesc.includes('love') || pDesc.includes('relationship') || pDesc.includes('romance') || pName.includes('rose quartz') || pDesc.includes('rose quartz') || pDesc.includes('rhodonite'))) return true;
      if (stripped === 'protection' && (pDesc.includes('protect') || pDesc.includes('shield') || pDesc.includes('evil eye') || pDesc.includes('grounding') || pName.includes('tourmaline') || pName.includes('obsidian') || pName.includes('tiger') || pDesc.includes('black tourmaline'))) return true;
      if (stripped === 'peace-relaxation' && (pDesc.includes('calm') || pDesc.includes('peace') || pDesc.includes('relax') || pDesc.includes('serenity') || pDesc.includes('stress') || pName.includes('amethyst') || pName.includes('selenite'))) return true;
      if (stripped === 'focus-studies' && (pDesc.includes('focus') || pDesc.includes('study') || pDesc.includes('studies') || pDesc.includes('concentration') || pDesc.includes('clarity') || pName.includes('fluorite') || pName.includes('clear quartz'))) return true;
      if (stripped === 'confidence' && (pDesc.includes('confidence') || pDesc.includes('courage') || pDesc.includes('power') || pName.includes('tiger') || pName.includes('carnelian') || pDesc.includes('solar plexus'))) return true;
      if (stripped === 'career-business' && (pDesc.includes('career') || pDesc.includes('business') || pDesc.includes('success') || pDesc.includes('luck') || pName.includes('pyrite') || pName.includes('aventurine') || pName.includes('green aventurine'))) return true;
      if (stripped === 'manifestation' && (pDesc.includes('manifest') || pDesc.includes('manifestation') || pDesc.includes('intention') || pName.includes('pyrite') || pName.includes('clear quartz') || pName.includes('citrine'))) return true;
      if (stripped === 'spiritual-growth' && (pDesc.includes('spiritual') || pDesc.includes('meditation') || pDesc.includes('intuition') || pDesc.includes('awakening') || pName.includes('amethyst') || pName.includes('labradorite') || pName.includes('selenite') || pName.includes('chakra'))) return true;
      if (stripped === 'healing-wellness' && (pDesc.includes('heal') || pDesc.includes('wellness') || pDesc.includes('vitality') || pDesc.includes('recovery') || pName.includes('fluorite') || pName.includes('clear quartz') || pName.includes('jasper') || pName.includes('jade'))) return true;
      const purposeName = stripped.replace(/-/g, ' ');
      return pName.includes(purposeName) || pDesc.includes(purposeName) || assignedSet.has(purposeName);
    }

    // 2. Energy System matching
    if (fid.startsWith('energy:')) {
      // General Chakras grouping
      if (stripped === '7-chakras' || stripped === 'chakras' || stripped === 'chakra') {
        return Boolean(pChakra && pChakra.length > 0) || pName.includes('chakra') || pDesc.includes('chakra');
      }
      // Specific Chakras
      if (stripped.includes('root') && (pChakra.includes('root') || pChakra.includes('muladhara') || pDesc.includes('root chakra'))) return true;
      if (stripped.includes('sacral') && (pChakra.includes('sacral') || pChakra.includes('svadhishthana') || pDesc.includes('sacral chakra'))) return true;
      if (stripped.includes('solar-plexus') && (pChakra.includes('solar plexus') || pChakra.includes('manipura') || pName.includes('pyrite') || pName.includes('citrine') || pDesc.includes('solar plexus'))) return true;
      if (stripped.includes('heart') && (pChakra.includes('heart') || pChakra.includes('anahata') || pName.includes('rose quartz') || pDesc.includes('heart chakra') || pDesc.includes('heart'))) return true;
      if (stripped.includes('throat') && (pChakra.includes('throat') || pChakra.includes('vishuddha') || pDesc.includes('throat chakra'))) return true;
      if (stripped.includes('third-eye') && (pChakra.includes('third eye') || pChakra.includes('ajna') || pName.includes('amethyst') || pDesc.includes('third eye'))) return true;
      if (stripped.includes('crown') && (pChakra.includes('crown') || pChakra.includes('sahasrara') || pName.includes('clear quartz') || pName.includes('amethyst') || pDesc.includes('crown chakra'))) return true;

      // Zodiac
      if (stripped === 'zodiac' || stripped === 'astrology') {
        return Boolean(pZodiac && pZodiac.length > 0) || pName.includes('zodiac') || pDesc.includes('zodiac') || pDesc.includes('astrology') || pDesc.includes('birthstone');
      }
      if (stripped.startsWith('zodiac-')) {
        const sign = stripped.replace('zodiac-', '');
        return pZodiac.includes(sign) || pDesc.includes(sign) || pName.includes(sign);
      }

      // Numerology
      if (stripped === 'numerology' || stripped === 'numbers') {
        return pDesc.includes('numerology') || pDesc.includes('number') || pName.includes('numerology') || pDesc.includes('life path') || assigned.some((a) => a.includes('num-'));
      }
      if (stripped.startsWith('num-')) {
        const numVal = stripped.replace('num-', '');
        return pDesc.includes(`number ${numVal}`) || pDesc.includes(`life path ${numVal}`) || assignedSet.has(stripped);
      }

      // Planetary
      if (stripped === 'planetary' || stripped === 'planetary-energy') {
        return pDesc.includes('planet') || pDesc.includes('astrology') || pDesc.includes('sun') || pDesc.includes('moon') || pDesc.includes('mars') || pDesc.includes('jupiter') || pDesc.includes('saturn') || pDesc.includes('mercury') || pDesc.includes('venus') || pDesc.includes('rahu') || pDesc.includes('ketu') || assigned.some((a) => a.includes('planet-'));
      }
      if (stripped.startsWith('planet-')) {
        const planet = stripped.replace('planet-', '');
        return pDesc.includes(planet) || pName.includes(planet);
      }

      // Aura & Energy
      if (stripped === 'aura-energy' || stripped === 'aura') {
        return pDesc.includes('aura') || pName.includes('aura') || pDesc.includes('biofield') || pDesc.includes('vibration') || pDesc.includes('energy');
      }

      // Vastu Remedy
      if (stripped === 'vastu' || stripped === 'vastu-remedy') {
        return pDesc.includes('vastu') || pName.includes('vastu') || pCategory.includes('tree') || pName.includes('tree') || pCategory.includes('pyramid') || pName.includes('pyramid') || pCategory.includes('plate') || pName.includes('plate');
      }

      const energyTerm = stripped.replace(/-/g, ' ');
      return pDesc.includes(energyTerm) || pName.includes(energyTerm);
    }

    // 3. Crystal / Specimen matching
    if (fid.startsWith('crystal:')) {
      const crystalName = stripped.replace(/-/g, ' ');
      return pCrystal.includes(crystalName) || pName.includes(crystalName) || pDesc.includes(crystalName);
    }
    if (fid.startsWith('specimen:')) {
      if (stripped === 'raw-stones' && (pCategory.includes('raw') || pCategory.includes('geode') || pName.includes('raw') || pName.includes('geode') || pName.includes('cluster'))) return true;
      if (stripped === 'towers-points' && (pCategory.includes('tower') || pName.includes('tower') || pName.includes('point'))) return true;
      if (stripped === 'tumbled-stones' && (pCategory.includes('tumble') || pName.includes('tumble'))) return true;
      if (stripped === 'pyramids' && (pCategory.includes('pyramid') || pName.includes('pyramid'))) return true;
      if (stripped === 'spheres-orbs' && (pCategory.includes('sphere') || pName.includes('sphere'))) return true;
      if (stripped === 'crystal-clusters' && (pCategory.includes('cluster') || pName.includes('cluster'))) return true;
      const formTerm = stripped.replace(/-/g, ' ');
      return pCategory.includes(formTerm) || pName.includes(formTerm);
    }

    // 4. Jewellery matching
    if (fid.startsWith('jewellery:')) {
      if (stripped === 'bracelets') {
        return pName.includes('bracelet') || pName.includes('bracelete') || pCategory.includes('bracelet') || (pCategory.includes('band') && !pName.includes('mala'));
      }
      if (stripped === 'malas') {
        return pName.includes('mala') || pCategory.includes('mala');
      }
      if (stripped === 'necklaces' && (pCategory.includes('necklace') || pName.includes('necklace'))) return true;
      if (stripped === 'pendants' && (pCategory.includes('pendant') || pName.includes('pendant'))) return true;
      if (stripped === 'rings' && (pCategory.includes('ring') || pName.includes('ring'))) return true;
      if (stripped === 'earrings' && (pCategory.includes('earring') || pName.includes('earring'))) return true;
      if (stripped === 'beads' && (pCategory.includes('bead') || pName.includes('bead'))) return true;
      return pCategory.includes(stripped) || pName.includes(stripped);
    }

    // 5. Bead Size matching (strict variant-level verification)
    if (fid.startsWith('bead:')) {
      const targetSize = stripped.toLowerCase(); // '4mm', '6mm', '8mm', '10mm', '12mm-plus'
      const hasVariantSize = variants.some((v) => {
        const bs = (v.bead_size || v.beadSize || v.name || '').toLowerCase();
        if (targetSize === '4mm' && bs.includes('4mm')) return true;
        if (targetSize === '6mm' && bs.includes('6mm')) return true;
        if (targetSize === '8mm' && (bs.includes('8mm') || bs.includes('8 mm'))) return true;
        if (targetSize === '10mm' && (bs.includes('10mm') || bs.includes('10 mm'))) return true;
        if (targetSize === '12mm-plus' && (bs.includes('12mm') || bs.includes('14mm') || bs.includes('16mm'))) return true;
        if (targetSize === 'custom-size' && bs.includes('custom')) return true;
        return false;
      });
      if (hasVariantSize) return true;

      // Check product name/beadSize attribute
      const pBeadSize = (product.beadSize || product.bead_size || '').toLowerCase();
      if (targetSize === '8mm' && (pBeadSize.includes('8mm') || pName.includes('8mm'))) return true;
      if (targetSize === '6mm' && (pBeadSize.includes('6mm') || pName.includes('6mm'))) return true;
      if (targetSize === '10mm' && (pBeadSize.includes('10mm') || pName.includes('10mm'))) return true;
      if (targetSize === '4mm' && (pBeadSize.includes('4mm') || pName.includes('4mm'))) return true;
      return false;
    }

    // 6. Home & Space matching
    if (fid.startsWith('home:')) {
      if (stripped === 'crystal-trees' && (pCategory.includes('tree') || pName.includes('tree'))) return true;
      if (stripped === 'vastu-crystals' && (pCategory.includes('vastu') || pDesc.includes('vastu') || pName.includes('vastu'))) return true;
      if (stripped === 'crystal-pyramids' && (pCategory.includes('pyramid') || pName.includes('pyramid'))) return true;
      const homeTerm = stripped.replace(/-/g, ' ');
      return pCategory.includes(homeTerm) || pDesc.includes(homeTerm) || pName.includes(homeTerm);
    }

    return false;
  };

  // AND across all dimensions: each active dimension must have at least one matching filter (OR within dimension)
  for (const pillar of Object.keys(dimensionGroups)) {
    const filtersInDimension = dimensionGroups[pillar];
    const anyMatchedInDimension = filtersInDimension.some((filterId) => matchesSingleFilter(filterId));
    if (!anyMatchedInDimension) {
      return false;
    }
  }

  return true;
}

/**
 * Test whether a product matches an entire discovery pillar
 */
export function productMatchesPillar(product, pillarId) {
  if (!product || !pillarId || pillarId === 'all') return true;
  const pName = (product.name || '').toLowerCase();
  const pCategory = (product.category || '').toLowerCase();
  const pDesc = (product.description || product.short_description || '').toLowerCase();
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const assigned = Array.isArray(product.assigned_filters)
    ? product.assigned_filters
    : (Array.isArray(product.assignedFilters) ? product.assignedFilters : []);

  const pillarPrefixes = {
    purpose: ['purpose:'],
    energy_system: ['energy:'],
    crystal_specimen: ['crystal:', 'specimen:'],
    jewellery: ['jewellery:'],
    bead_size: ['bead:'],
    home_space: ['home:'],
  };

  const prefixes = pillarPrefixes[pillarId];
  if (prefixes && assigned.some((f) => prefixes.some((pfx) => f.startsWith(pfx)))) {
    return true;
  }

  if (pillarId === 'jewellery') {
    return (
      pName.includes('bracelet') ||
      pName.includes('bracelete') ||
      pName.includes('mala') ||
      pName.includes('necklace') ||
      pName.includes('pendant') ||
      pName.includes('ring') ||
      pCategory.includes('bracelet') ||
      pCategory.includes('band') ||
      pCategory.includes('mala') ||
      pCategory.includes('jewel')
    );
  }

  if (pillarId === 'crystal_specimen') {
    return (
      pCategory.includes('raw') ||
      pCategory.includes('geode') ||
      pCategory.includes('stone') ||
      pCategory.includes('cluster') ||
      pCategory.includes('tower') ||
      pCategory.includes('pyramid') ||
      pCategory.includes('crystal') ||
      pName.includes('pyrite') ||
      pName.includes('amethyst') ||
      pName.includes('quartz') ||
      pName.includes('cluster') ||
      pName.includes('raw') ||
      pName.includes('geode')
    );
  }

  if (pillarId === 'home_space') {
    return (
      pCategory.includes('home') ||
      pCategory.includes('decor') ||
      pCategory.includes('tree') ||
      pCategory.includes('vastu') ||
      pName.includes('tree') ||
      (pName.includes('pyramid') && !pName.includes('bracelet')) ||
      pName.includes('fountain') ||
      pName.includes('altar')
    );
  }

  if (pillarId === 'bead_size') {
    return variants.length > 0 || pName.includes('mm') || Boolean(product.beadSize || product.bead_size);
  }

  if (pillarId === 'energy_system') {
    return (
      Boolean(product.chakra || product.zodiac) ||
      pDesc.includes('chakra') ||
      pDesc.includes('energy') ||
      pDesc.includes('aura') ||
      pDesc.includes('vastu') ||
      pName.includes('chakra') ||
      pName.includes('7')
    );
  }

  if (pillarId === 'purpose') {
    return (
      Boolean(product.short_description) ||
      pDesc.includes('love') ||
      pDesc.includes('wealth') ||
      pDesc.includes('money') ||
      pDesc.includes('peace') ||
      pDesc.includes('calm') ||
      pDesc.includes('protect') ||
      pDesc.includes('positive') ||
      pDesc.includes('healing') ||
      pDesc.includes('abundance')
    );
  }

  return true;
}
