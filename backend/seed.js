require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crystal-ecom';

const seedProducts = [
  {
    name: 'Amethyst Cathedral Geode',
    slug: 'amethyst-cathedral-geode',
    shortDescription: 'Deep violet Uruguayan amethyst geode with polished agate rim and quartz crystalline matrix.',
    description:
      'Harvested from deep basaltic cavities in Artigas, Uruguay, this museum-grade Amethyst Cathedral features lustrous royal purple crystal points encased in a polished natural agate ribbon. Amethyst is prized across millennia as the master stone of mental clarity, spiritual attunement, and deep meditative stillness.',
    crystalType: 'Amethyst',
    chakra: ['Crown', 'Third Eye'],
    form: 'Cluster',
    origin: 'Artigas, Uruguay',
    metaphysicalProperties: [
      'Facilitates deep transcendental meditation',
      'Transforms chaotic frequency into serene high-vibrational energy',
      'Harmonizes the Crown and Third Eye chakras',
      'Shields the aura from electromagnetic disturbance',
    ],
    careInstructions: 'Keep away from direct prolonged sunlight to preserve deep amethyst color intensity. Cleanse with sacred smoke or sound baths.',
    basePrice: 14500,
    currency: 'INR',
    variants: [
      { label: 'Medium (1.2 - 1.6 kg)', priceModifier: 0, stock: 12, sku: 'AME-CAT-M' },
      { label: 'Large (2.5 - 3.2 kg)', priceModifier: 7500, stock: 6, sku: 'AME-CAT-L' },
      { label: 'Master Collector (5.0+ kg)', priceModifier: 18000, stock: 2, sku: 'AME-CAT-XL' },
    ],
    totalStock: 20,
    images: [
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.1,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/AME-CAT-2026.pdf',
    sourcedFrom: 'Artigas Geological Reserve, Uruguay (Fair-Mined Artisanal Cooperative)',
    artisanRepresentative: 'Mateo Delgado, Master Lapidary',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.9,
    ratingCount: 38,
  },
  {
    name: 'Madagascar Rose Quartz Monolith',
    slug: 'madagascar-rose-quartz-monolith',
    shortDescription: 'Translucent blush-pink rose quartz freeform sculpture with chatoyant optical sheen.',
    description:
      'Sourced directly from the high-altitude pegmatites of Antananarivo, Madagascar, this pure Rose Quartz monolith displays a soft luminous translucent glow. Polished by hand over 40 hours to preserve its organic geological contour, this stone radiates the pure unconditional resonance of the Heart Chakra.',
    crystalType: 'Rose Quartz',
    chakra: ['Heart'],
    form: 'Polished',
    origin: 'Antananarivo, Madagascar',
    metaphysicalProperties: [
      'Activates the Anahata (Heart) energetic center',
      'Dissolves emotional tension and fosters unconditional self-compassion',
      'Cultivates harmonic balance in intimate partnerships',
      'Restores trust and emotional equilibrium after distress',
    ],
    careInstructions: 'Rinse with pure mountain spring water or wipe with an organic microfiber cloth. Recharge under full moonlight.',
    basePrice: 8900,
    currency: 'INR',
    variants: [
      { label: 'Desktop Freeform (800g)', priceModifier: 0, stock: 18, sku: 'RQ-MONO-800' },
      { label: 'Statement Monolith (2.0 kg)', priceModifier: 6200, stock: 8, sku: 'RQ-MONO-2K' },
    ],
    totalStock: 26,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.0,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/RQ-MDG-902.pdf',
    sourcedFrom: 'Vakinankaratra Pegmatite Basin, Madagascar',
    artisanRepresentative: 'Jean-Luc Rakoto, Lapidary Guild Director',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.8,
    ratingCount: 52,
  },
  {
    name: 'Golden Imperial Pyrite Cube',
    slug: 'golden-imperial-pyrite-cube',
    shortDescription: 'Naturally perfect isometric pyrite crystals embedded in white marl matrix from Spain.',
    description:
      'From the world-renowned Navajún deposit in La Rioja, Spain, these isometric pyrite cubes are not carved — nature crystalized them into pristine mathematical symmetry over 130 million years. Known as the Stone of Solar Will, Pyrite amplifies manifestation, executive focus, and sovereign personal vitality.',
    crystalType: 'Pyrite',
    chakra: ['Solar Plexus', 'Root'],
    form: 'Raw',
    origin: 'Navajún, Spain',
    metaphysicalProperties: [
      'Ignites the inner fire of the Manipura (Solar Plexus) chakra',
      'Bolsters confidence, mental resolve, and business acumen',
      'Grounds excess emotional energy through dense iron-sulfur frequency',
      'Deflects energy leaks and psychic exhaustion',
    ],
    careInstructions: 'Do not submerge in water. Clean gently with a soft bristle brush. Keep in low humidity environments.',
    basePrice: 11200,
    currency: 'INR',
    variants: [
      { label: 'Single Perfect Cube (4cm Matrix)', priceModifier: 0, stock: 14, sku: 'PYR-CUBE-S' },
      { label: 'Twin Cluster (7cm Matrix)', priceModifier: 5500, stock: 7, sku: 'PYR-CUBE-TW' },
      { label: 'Monumental Matrix (12cm)', priceModifier: 14000, stock: 3, sku: 'PYR-CUBE-MAX' },
    ],
    totalStock: 24,
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 0.95,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/PYR-SPN-441.pdf',
    sourcedFrom: 'Victoria Mine, Navajún, La Rioja, Spain',
    artisanRepresentative: 'Elena Sanz, Certified Mineralogist',
    isFeatured: true,
    isActive: true,
    ratingAverage: 5.0,
    ratingCount: 29,
  },
  {
    name: 'Spectrolite Labradorite Freeform',
    slug: 'spectrolite-labradorite-freeform',
    shortDescription: 'Full-spectrum labradorescence displaying peacock blues, molten gold, and emerald flashes.',
    description:
      'Discovered in Ylämaa, Finland, Spectrolite is the rarest and most vibrant variety of Labradorite on Earth. When kissed by ambient light, it displays dramatic optical interference (Schiller effect) across the full spectrum. An ancient talisman of mystical sight, awakening, and auric shielding.',
    crystalType: 'Labradorite',
    chakra: ['Throat', 'Third Eye', 'Crown'],
    form: 'Polished',
    origin: 'Ylämaa, Finland',
    metaphysicalProperties: [
      'Awakens intuition, claircognizance, and esoteric synchronicities',
      'Creates an impenetrable photonic shield around the auric field',
      'Helps navigate multidimensional consciousness and lucid dreaming',
      'Aligns vocal expression with authentic soul truth',
    ],
    careInstructions: 'Clean with a soft dry cotton cloth. Enhance luster with natural cedarwood or sandalwood smoke.',
    basePrice: 16800,
    currency: 'INR',
    variants: [
      { label: 'Hand-Held Prism (600g)', priceModifier: 0, stock: 9, sku: 'SPEC-LAB-600' },
      { label: 'Master Display (1.8 kg)', priceModifier: 9500, stock: 4, sku: 'SPEC-LAB-1800' },
    ],
    totalStock: 13,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.0,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/SPEC-FIN-102.pdf',
    sourcedFrom: 'Ylämaa Spectrolite Quarry, Karelia, Finland',
    artisanRepresentative: 'Henrik Virtanen, Nordic Lapidary Master',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.95,
    ratingCount: 44,
  },
  {
    name: 'Himalayan Optical Clear Quartz Wand',
    slug: 'himalayan-optical-clear-quartz-wand',
    shortDescription: 'Flawless water-clear quartz double-terminated wand from 14,000 ft Himalayan peaks.',
    description:
      'Hand-gathered by native mountain sherpas above 14,000 feet in the sacred Kullu Valley of the Indian Himalayas, this optical-grade Clear Quartz wand features immaculate clarity, prismatic rainbows inside internal growth veils, and pristine natural double terminations. Known as the Ultimate Energy Amplifier.',
    crystalType: 'Clear Quartz',
    chakra: ['Crown'],
    form: 'Carved',
    origin: 'Kullu Valley, Himalayas, India',
    metaphysicalProperties: [
      'Universal programmable crystal amplifier for any intention',
      'Clears mental static and stimulates higher intellectual insight',
      'Harmonizes all seven bodily chakras into perfect coherence',
      'Receives, stores, and transmits cosmic vibrational frequencies',
    ],
    careInstructions: 'Cleanse in natural flowing river water or Tibetan singing bowl sound vibrations. Sun-bathe at dawn.',
    basePrice: 13500,
    currency: 'INR',
    variants: [
      { label: '6-inch Double Terminated', priceModifier: 0, stock: 15, sku: 'HIM-CQ-6' },
      { label: '9-inch Master Transmitter', priceModifier: 7000, stock: 5, sku: 'HIM-CQ-9' },
    ],
    totalStock: 20,
    images: [
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.2,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/HIM-CQ-088.pdf',
    sourcedFrom: 'Manikaran High Ridge, Kullu, Himachal Pradesh',
    artisanRepresentative: 'Tsering Dorje, Himalayan Traditional Carver',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.9,
    ratingCount: 67,
  },
  {
    name: 'Moroccan Satin-Spar Selenite Tower',
    slug: 'moroccan-satin-spar-selenite-tower',
    shortDescription: 'Architectural fluted tower of pearlescent satin-spar selenite with luminous white glow.',
    description:
      'Sourced from ancient dried seabed mineral deposits in Midelt, Morocco, this Selenite skyscraper tower exhibits high optical fiber translucency that channels light throughout its crystalline columns. Named after Selene, the Greek Goddess of the Moon, Selenite is self-cleansing and purifies all adjacent stones.',
    crystalType: 'Selenite',
    chakra: ['Crown', 'Third Eye'],
    form: 'Carved',
    origin: 'Midelt, Morocco',
    metaphysicalProperties: [
      'Continuous automatic aura and room space clearing',
      'Never needs energetic cleansing — transmutes negative static',
      'Facilitates angelic connection and deep calm for restful sleep',
      'Cleanses and recharges other gemstone jewelry placed on it',
    ],
    careInstructions: 'WATER SOLUBLE: Never expose to water or damp environments. Dust lightly with a dry soft makeup brush.',
    basePrice: 6500,
    currency: 'INR',
    variants: [
      { label: '20cm Table Tower', priceModifier: 0, stock: 22, sku: 'SEL-TOW-20' },
      { label: '35cm Floor Statement', priceModifier: 4800, stock: 10, sku: 'SEL-TOW-35' },
    ],
    totalStock: 32,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.15,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/SEL-MOR-501.pdf',
    sourcedFrom: 'Atlas Mountain Foothills, Midelt, Morocco',
    artisanRepresentative: 'Omar Bennani, Atlas Artisan Collective',
    isFeatured: false,
    isActive: true,
    ratingAverage: 4.85,
    ratingCount: 31,
  },
  {
    name: 'Obsidian Scrying Mirror with Gold Sheen',
    slug: 'obsidian-scrying-mirror-with-gold-sheen',
    shortDescription: 'Hand-lapped volcanic glass mirror with celestial golden micaceous shimmer.',
    description:
      'Formed by rapid cooling of rhyolitic volcanic magma in the Jalisco mountains of Mexico, this ceremonial Obsidian Mirror is polished to a flawless mirror finish. When held at an angle under light, microscopic gas bubbles produce a mysterious shimmering golden glow.',
    crystalType: 'Black Obsidian',
    chakra: ['Root'],
    form: 'Carved',
    origin: 'Jalisco, Mexico',
    metaphysicalProperties: [
      'Supreme psychic protection stone of ancient Mesoamerican shamans',
      'Reveals subconscious shadow aspects for conscious integration',
      'Anchors the energetic body deep into the Earth core',
      'Dissolves emotional blockages and ancient behavioral conditioning',
    ],
    careInstructions: 'Clean with natural spring water and dry with velvet. Cleanse using white copal resin incense.',
    basePrice: 9400,
    currency: 'INR',
    variants: [
      { label: '15cm Diameter Stand Mirror', priceModifier: 0, stock: 16, sku: 'OBS-MIR-15' },
      { label: '22cm Ceremonial Disk', priceModifier: 5200, stock: 7, sku: 'OBS-MIR-22' },
    ],
    totalStock: 23,
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 0.9,
    certificateUrl: 'https://cdn.lumiere-crystals.com/certs/OBS-MEX-312.pdf',
    sourcedFrom: 'Tequila Volcanic Province, Jalisco, Mexico',
    artisanRepresentative: 'Carlos Hernandez, Obsidian Craftsman',
    isFeatured: false,
    isActive: true,
    ratingAverage: 4.92,
    ratingCount: 19,
  },
  {
    name: 'Sunset Citrine Cathedral Point',
    slug: 'sunset-citrine-cathedral-point',
    shortDescription: 'All-natural unheated golden-amber citrine point with dendritic phantom inclusions.',
    description:
      'Unlike heat-treated amethyst sold elsewhere, this authentic 100% natural Citrine was gently irradiated by deep geological lithium fields in Minas Gerais, Brazil over millions of years. It exhibits a warm honey-champagne gradient and crisp architectural termination.',
    crystalType: 'Citrine',
    chakra: ['Solar Plexus', 'Sacral'],
    form: 'Polished',
    origin: 'Minas Gerais, Brazil',
    metaphysicalProperties: [
      'The Merchant Stone: Magnetizes abundance, commercial prosperity, and wealth',
      'Stimulates creativity, optimism, and uninhibited self-expression',
      'Recharges personal stamina and overcomes chronic sluggishness',
      'Does not accumulate negativity — constantly radiates solar warmth',
    ],
    careInstructions: 'Clean with warm mild soapy water. Place on an east-facing windowsill to capture early morning light.',
    basePrice: 18200,
    currency: 'INR',
    variants: [
      { label: 'Collector Point (1.1 kg)', priceModifier: 0, stock: 8, sku: 'CIT-BRZ-11' },
      { label: 'Master Geode Obelisk (2.8 kg)', priceModifier: 11000, stock: 3, sku: 'CIT-BRZ-28' },
    ],
    totalStock: 11,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.05,
    certificateUrl: 'https://cdn.sumuk-crystalz.com/certs/CIT-BRZ-771.pdf',
    sourcedFrom: 'Corinto Mine, Minas Gerais, Brazil',
    artisanRepresentative: 'Luiz Carvalho, Gemstone Prospector',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.96,
    ratingCount: 37,
  },
  {
    name: "Golden Tiger's Eye Shield & Freeform",
    slug: 'golden-tigers-eye-shield-freeform',
    shortDescription: 'Silky chatoyant golden-brown metamorphic quartz specimen providing fierce grounding and auric protection.',
    description:
      'Hand-selected by Soumyaa Naveen from the ancient banded iron formations of Griqualand West, South Africa. This Golden Tiger’s Eye specimen exhibits deep undulating chatoyant bands of silky gold, amber, and mahogany. Revered as the stone of bold protective warmth, physical courage, and unshakeable willpower.',
    crystalType: "Tiger's Eye",
    chakra: ['Solar Plexus', 'Sacral', 'Root'],
    form: 'Polished',
    origin: 'Northern Cape, South Africa',
    metaphysicalProperties: [
      'Anchors bold, protective warmth and deflects energy intrusions',
      'Harmonizes the Solar Plexus, Sacral, and Root chakras',
      'Bolsters confidence, executive decision making, and mental grit',
      'Nurtures inner calm during high-stress transitions',
    ],
    careInstructions: 'Cleanse with sandalwood or sage sacred smoke. Polish with a soft microfiber cloth to preserve high chatoyant luster.',
    basePrice: 7800,
    currency: 'INR',
    variants: [
      { label: 'Sanctuary Freeform (650g)', priceModifier: 0, stock: 16, sku: 'TE-FREE-650' },
      { label: 'Collector Statement Slab (1.8 kg)', priceModifier: 5800, stock: 6, sku: 'TE-SLAB-18' },
    ],
    totalStock: 22,
    images: [
      'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80',
    ],
    model3dUrl: '',
    model3dScale: 1.0,
    certificateUrl: 'https://cdn.sumuk-crystalz.com/certs/TE-SAF-811.pdf',
    sourcedFrom: 'Griqualand West Pegmatite Belt, South Africa',
    artisanRepresentative: 'Soumyaa Naveen, Founder & Curator',
    isFeatured: true,
    isActive: true,
    ratingAverage: 4.98,
    ratingCount: 42,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding:', MONGODB_URI);

    // 1. Seed or update Admin user: Soumyaa Naveen
    const adminEmail = 'sumukcrystalz@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'Soumyaa Naveen',
        email: adminEmail,
        role: 'admin',
        phone: '+919876543210',
      });
      await admin.setPassword('SoumyaNaveen@30');
      await admin.save();
      console.log('Created admin user: sumukcrystalz@gmail.com / SoumyaNaveen@30');
    } else {
      admin.name = 'Soumyaa Naveen';
      admin.role = 'admin';
      await admin.setPassword('SoumyaNaveen@30');
      await admin.save();
      console.log('Updated existing admin user: sumukcrystalz@gmail.com / SoumyaNaveen@30');
    }

    // 2. Seed Products
    for (const prodData of seedProducts) {
      const existing = await Product.findOne({ slug: prodData.slug });
      if (existing) {
        await Product.updateOne({ slug: prodData.slug }, { $set: prodData });
        console.log(`Updated product: ${prodData.name}`);
      } else {
        await Product.create(prodData);
        console.log(`Created product: ${prodData.name}`);
      }
    }

    console.log('Database successfully seeded with Sumuk Crystalz 5 luxury collection!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
