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

const LABEL_MAP = {};
DISCOVERY_PILLARS.forEach((pillar) => {
  pillar.options.forEach((opt) => {
    LABEL_MAP[opt.id] = opt.label;
    LABEL_MAP[opt.value] = opt.label;
  });
});

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

export function formatProductMultiTags(product, maxTags = 4) {
  if (!product) return [];
  const rawTags = Array.isArray(product.assigned_filters)
    ? product.assigned_filters
    : (Array.isArray(product.assignedFilters) ? product.assignedFilters : (Array.isArray(product.tags) ? product.tags : []));

  return rawTags.slice(0, maxTags).map((tagId) => ({
    id: tagId,
    label: getFilterLabel(tagId),
  }));
}
