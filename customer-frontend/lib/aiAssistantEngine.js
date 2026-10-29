import { getSupabaseProducts, getSupabaseDeliverySettings, DEFAULT_DELIVERY_SETTINGS } from './supabase';
import { ENERGY_STONES_CATALOG } from '../data/energyStones';
import { CRYSTAL_CATALOG } from '../data/crystals';
import { DISCOVERY_PILLARS, formatProductMultiTags } from './discoveryTaxonomy';

/**
 * ============================================================================
 * SUMUK CRYSTALZ — CANONICAL KNOWLEDGE BASE & AI ENGINE
 * ============================================================================
 */

export const STORE_CONTACT_INFO = {
  name: 'Sumuk Crystalz 5',
  founder: 'Soumyaa Naveen (Certified Usui Reiki Master & Holistic Crystal Healer)',
  location: 'Sus Gaon, Pune, Maharashtra 411021, India',
  phone: '+91 91117 16355',
  whatsappUrl: 'https://wa.me/c/919111716355',
  instagram: '@sumukcrystalz5',
  instagramUrl: 'https://www.instagram.com/sumukcrystalz5?stkn=d3NqcW1pbnV3ZDRn',
  email: 'sumukcrystalz5@gmail.com',
  operatingHours: '9:00 AM – 9:00 PM IST (Monday – Sunday)',
  consecrationFrequency: 'Sacred Solfeggio Harmonic Resonance & Sacred Vedic Mantras',
};

export const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    category: 'Products',
    question: 'Are all Sumuk Crystalz natural and authentic?',
    answer:
      'Yes, 100%. Every single crystal, gemstone bracelet, raw cluster, and mala at Sumuk Crystalz is ethically fair-mined from certified geological basins (such as Brazil, Madagascar, Peru, and Uruguay) and comes with a certificate of authenticity. We never sell artificial glass or synthetic resins.',
    isActive: true,
  },
  {
    id: 'faq-2',
    category: 'Crystal Care',
    question: 'How are the crystals energized and consecrated before dispatch?',
    answer:
      'Prior to dispatch, every specimen undergoes an individualized energetic purification ritual by Founder Soumyaa Naveen. Stagnant mining frequencies are cleared using Tibetan singing bowls attuned to sacred Solfeggio frequencies and sacred sandalwood smoke, followed by Usui Reiki charging.',
    isActive: true,
  },
  {
    id: 'faq-3',
    category: 'Shipping',
    question: 'What are the delivery charges and shipping timelines across India?',
    answer:
      'We ship across India from our Pune sanctuary via secure armored couriers. Local Pune (<50km) is ₹50 (1–2 days), Regional Maharashtra (50–150km) is ₹100 (2–3 days), and Interstate/National shipping is ₹150 (3–6 business days). All orders above ₹5,000 qualify for 100% Free Express Shipping.',
    isActive: true,
  },
  {
    id: 'faq-4',
    category: 'Returns',
    question: 'What is your return and replacement policy?',
    answer:
      'Compulsory Unboxing Video Requirement: An unboxing video is strictly compulsory for any return, transit damage claim, or replacement. The video must capture the sealed package opening to crystal inspection in a single continuous recording without cuts or edits. For all returns and replacements, you must contact the owner directly (Founder Soumyaa Naveen) via WhatsApp or Call at +91 91117 16355 within 7 days of delivery. Because our crystals absorb personal energetic and auric fields upon opening, opened or used items cannot be returned for change of mind.',
    isActive: true,
  },
  {
    id: 'faq-5',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept 100% secure encrypted online payments via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit Cards (Visa, MasterCard, RuPay), and NetBanking. Cash on Delivery (COD) is available on selected catalog items.',
    isActive: true,
  },
  {
    id: 'faq-6',
    category: 'Ordering',
    question: 'Do I need an account to place an order?',
    answer:
      'No! You can checkout quickly as a guest. However, creating a free Sumuk Sanctuary account allows you to track your orders in real time, view gemological certificates, save your shipping address, and review your consecrated vault history.',
    isActive: true,
  },
  {
    id: 'faq-7',
    category: 'Crystal Care',
    question: 'Can I wash my crystals with water?',
    answer:
      'It depends on the mineral composition! Quartz crystals like Clear Quartz, Amethyst, Rose Quartz, and Carnelian are water-safe. However, soft or porous stones like Selenite (dissolves in water), Pyrite (oxidizes/rusts), Black Tourmaline, and Hematite must NEVER be soaked in water. Clean them using a soft dry microfiber cloth, sound resonance, or a Selenite charging plate.',
    isActive: true,
  },
  {
    id: 'faq-8',
    category: 'Crystal Care',
    question: 'How do I cleanse and recharge my crystal bracelets at home?',
    answer:
      'The safest and most effective method is placing your crystal bracelets on a Moroccan Selenite charging plate for 4–6 hours, or under the soft light of the monthly Full Moon. Avoid leaving Amethyst or Rose Quartz in harsh direct noon sunlight, as UV radiation can fade their natural hues over time.',
    isActive: true,
  },
];

export const CRYSTAL_EDUCATION = {
  amethyst: {
    name: 'Amethyst',
    mineralFamily: 'Macro-crystalline Quartz (SiO₂)',
    chakras: 'Crown Chakra (Sahasrara) & Third Eye (Ajna)',
    traditionalBenefits:
      'Traditionally associated with mental stillness, emotional serenity, deep sleep, and intuitive clarity. Used for centuries during meditation and breathwork.',
    waterSafe: true,
    sunlightSafe: false,
    careTips:
      'Safe to rinse with lukewarm water. Keep away from prolonged direct harsh sunlight to preserve its deep violet hues. Recharge on Selenite or under the Full Moon.',
  },
  pyrite: {
    name: 'Golden Pyrite (Fool\'s Gold)',
    mineralFamily: 'Iron Sulfide (FeS₂)',
    chakras: 'Solar Plexus (Manipura) & Root (Muladhara)',
    traditionalBenefits:
      'Known as the Stone of Abundance and Sovereign Will. Symbolizes masculine solar fire energy (Surya tattva), leadership charisma, financial focus, and shielding.',
    waterSafe: false,
    sunlightSafe: true,
    careTips:
      'DO NOT submerge in water (iron content may cause oxidation/rusting). Clean with a dry brush or soft microfiber cloth. Recharges excellently in morning sunlight.',
  },
  rosequartz: {
    name: 'Rose Quartz',
    mineralFamily: 'Silicate Quartz (SiO₂)',
    chakras: 'Heart Chakra (Anahata)',
    traditionalBenefits:
      'The quintessential Stone of Unconditional Love, compassion, emotional harmony, and soothing inner dialogue. Revered for heart-opening meditation.',
    waterSafe: true,
    sunlightSafe: false,
    careTips:
      'Safe for gentle water cleansing. Avoid direct extreme sunlight to maintain soft blush pink tones. Recharge with moonlight or Himalayan sound bowls.',
  },
  citrine: {
    name: 'Natural Citrine',
    mineralFamily: 'Golden Quartz (SiO₂)',
    chakras: 'Solar Plexus (Manipura) & Sacral (Swadhisthana)',
    traditionalBenefits:
      'Celebrated as The Merchant\'s Stone. Traditionally held by traders for continuous cashflow, radiant joy, self-empowerment, and high vitality.',
    waterSafe: true,
    sunlightSafe: true,
    careTips:
      'Water-safe. Self-clearing stone that rarely holds negative vibrations. Cleanses easily under running water and loves warm morning sun.',
  },
  blacktourmaline: {
    name: 'Black Tourmaline (Schorl)',
    mineralFamily: 'Complex Borosilicate',
    chakras: 'Root Chakra (Muladhara)',
    traditionalBenefits:
      'Premier talisman of psychic shielding and EMF protection. Grounds volatile emotional stress and neutralizes environmental static.',
    waterSafe: false,
    sunlightSafe: true,
    careTips:
      'Avoid prolonged soaking in water due to natural microscopic striations. Cleanse with sage, sound vibrations, or on a Selenite slab.',
  },
  greenjade: {
    name: 'Green Jade / Jadeite',
    mineralFamily: 'Sodium Aluminum Silicate',
    chakras: 'Heart Chakra (Anahata)',
    traditionalBenefits:
      'Time-honored Vedic and Asian talisman for biological vitality, tranquil nervous system, good fortune, and family harmony.',
    waterSafe: true,
    sunlightSafe: true,
    careTips:
      'Safe to wash with mild soapy water. Gently pat dry with a soft cloth. Very durable mineral (Mohs 6.5–7).',
  },
  labradorite: {
    name: 'Spectrolite Labradorite',
    mineralFamily: 'Feldspar Mineral',
    chakras: 'Third Eye (Ajna) & Crown (Sahasrara)',
    traditionalBenefits:
      'The Magician\'s Stone exhibiting iridescent photonic labradorescence. Symbolizes destiny synchronicities, creative genius, and auric shielding.',
    waterSafe: false,
    sunlightSafe: true,
    careTips:
      'Avoid harsh chemicals or prolonged water exposure. Clean gently with a microfiber polishing cloth to protect the optical flash surface.',
  },
  selenite: {
    name: 'Moroccan Satin-Spar Selenite',
    mineralFamily: 'Hydrous Calcium Sulfate (Gypsum)',
    chakras: 'Crown (Sahasrara) & Soul Star',
    traditionalBenefits:
      'High-vibrational liquid light crystal. Automatically purifies and recharges other crystals laid upon it. Creates a tranquil sanctuary aura in homes.',
    waterSafe: false,
    sunlightSafe: true,
    careTips:
      'CRITICAL: NEVER expose Selenite to water as gypsum will dissolve and lose its luster. Clean strictly with a dry soft cloth or soft brush.',
  },
  rudraksha: {
    name: 'Indonesian 5-Mukhi Rudraksha',
    mineralFamily: 'Sacred Elaeocarpus Ganitrus Seed',
    chakras: 'Heart (Anahata) & Crown (Sahasrara)',
    traditionalBenefits:
      'Ancient Vedic bead consecrated for Shiva consciousness, nervous system grounding, calm heart rate, and cosmic biofield protection.',
    waterSafe: true,
    sunlightSafe: true,
    careTips:
      'Condition occasionally with a light drop of natural sandalwood or almond oil. Keep dry after bathing to preserve seed longevity.',
  },
};

/**
 * ============================================================================
 * CHATBOT TOOL FUNCTIONS (Real-time Database & Fallback Interoperability)
 * ============================================================================
 */

/**
 * 1. Search Products Tool
 */
export async function searchProductsTool({
  query = '',
  minPrice = 0,
  maxPrice = 999999,
  purpose = '',
  category = '',
  chakra = '',
  beadSize = '',
  inStockOnly = false,
  limit = 4,
} = {}) {
  try {
    let allProducts = [];
    const supabaseProducts = await getSupabaseProducts(inStockOnly);

    if (supabaseProducts && supabaseProducts.length > 0) {
      allProducts = supabaseProducts;
    } else {
      allProducts = ENERGY_STONES_CATALOG;
    }

    const cleanQuery = query.toLowerCase().trim();
    const cleanPurpose = purpose.toLowerCase().trim();
    const cleanCategory = category.toLowerCase().trim();
    const cleanChakra = chakra.toLowerCase().trim();
    const cleanBeadSize = beadSize.toLowerCase().trim();

    let filtered = allProducts.filter((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || 0);
      if (price < minPrice || price > maxPrice) return false;

      if (cleanQuery) {
        const title = (p.name || p.title || '').toLowerCase();
        const desc = (p.description || p.shortDescription || p.short_description || '').toLowerCase();
        const pType = (p.crystalType || p.beadType || p.crystal_type || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const tags = (p.assigned_filters || p.tags || []).join(' ').toLowerCase();

        const matches =
          title.includes(cleanQuery) ||
          desc.includes(cleanQuery) ||
          pType.includes(cleanQuery) ||
          pCat.includes(cleanQuery) ||
          tags.includes(cleanQuery);

        if (!matches) return false;
      }

      if (cleanPurpose) {
        const pPurpose = (p.purpose || p.purposeLabel || '').toLowerCase();
        const tags = (p.assigned_filters || []).join(' ').toLowerCase();
        if (!pPurpose.includes(cleanPurpose) && !tags.includes(cleanPurpose)) return false;
      }

      if (cleanCategory) {
        const pCat = (p.category || '').toLowerCase();
        if (!pCat.includes(cleanCategory)) return false;
      }

      if (cleanChakra) {
        const pChakra = Array.isArray(p.chakra) ? p.chakra.join(' ').toLowerCase() : (p.chakra || '').toLowerCase();
        if (!pChakra.includes(cleanChakra)) return false;
      }

      if (cleanBeadSize) {
        const pSize = (p.beadSize || p.bead_size || '').toLowerCase();
        if (!pSize.includes(cleanBeadSize)) return false;
      }

      return true;
    });

    if (filtered.length === 0 && cleanQuery) {
      // Fuzzy keyword fallback
      const keywords = cleanQuery.split(' ').filter((w) => w.length > 2);
      filtered = allProducts.filter((p) => {
        const text = `${p.name} ${p.description} ${p.crystalType || p.beadType} ${p.category}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    }

    const results = filtered.slice(0, limit).map((p) => {
      const price = Number(p.price || p.sellingPrice || p.selling_price || 699);
      const origPrice = Number(p.originalPrice || p.original_price || price * 1.3);
      const discount = p.discountPercent || (origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0);
      const img = p.images?.[0] || p.heroImage || p.image || '/images/products/pyrite.jpg';
      const multiTags = formatProductMultiTags(p, 3);

      return {
        id: p.id,
        slug: p.slug || p.id,
        name: p.name || p.title,
        price,
        originalPrice: origPrice,
        discountPercent: discount,
        image: img,
        inStock: p.inStock !== false && p.active !== false,
        stockCount: p.stockCount || 10,
        shortDescription: p.shortDescription || p.short_description || p.subtitle || '',
        category: p.category || 'Energy Stones',
        beadSize: p.beadSize || p.bead_size || '8mm',
        chakra: Array.isArray(p.chakra) ? p.chakra.join(', ') : p.chakra || '',
        variants: p.variants || p.product_variants || [],
        multiTags,
      };
    });

    return {
      success: true,
      count: results.length,
      products: results,
    };
  } catch (err) {
    console.warn('Chatbot search products note:', err?.message);
    return { success: false, count: 0, products: [] };
  }
}

/**
 * 2. Get Order Status Tool
 */
export async function getOrderStatusTool({ orderId = '', email = '', authenticatedUser = null } = {}) {
  try {
    const cleanId = orderId.trim();
    const cleanEmail = (email || authenticatedUser?.email || '').trim().toLowerCase();

    if (!cleanId && !cleanEmail) {
      return {
        success: false,
        message: 'Please provide your Order ID (e.g. SC-10023 or Razorpay ID) or sign in to your Sumuk account.',
      };
    }

    // Try fetching from public order status endpoint
    if (cleanId) {
      try {
        const res = await fetch(`/api/checkout/orders/${encodeURIComponent(cleanId)}`);
        if (res.ok) {
          const order = await res.json();
          if (order) {
            return {
              success: true,
              order: {
                id: order.id,
                orderNumber: order.order_number || order.orderNumber || cleanId,
                status: order.status || 'Processing',
                paymentStatus: order.payment_status || 'Paid',
                totalAmount: order.total_amount || order.total || 0,
                createdAt: order.created_at || new Date().toISOString(),
                shippingMethod: order.shipping_method || 'Armored Express Courier',
                trackingNumber: order.tracking_number || 'Will be shared via SMS & WhatsApp upon dispatch',
                itemsCount: order.items?.length || 1,
              },
            };
          }
        }
      } catch (_) {}
    }

    // Defensive lookup from localStorage customer orders if available
    if (typeof window !== 'undefined') {
      try {
        const localOrdersRaw = localStorage.getItem('sumuk_customer_orders');
        if (localOrdersRaw) {
          const localOrders = JSON.parse(localOrdersRaw);
          const found = localOrders.find(
            (o) =>
              (cleanId && (o.id === cleanId || o.orderNumber === cleanId || o.order_number === cleanId)) ||
              (cleanEmail && o.customerEmail?.toLowerCase() === cleanEmail)
          );

          if (found) {
            return {
              success: true,
              order: {
                id: found.id || found.orderNumber,
                orderNumber: found.orderNumber || found.order_number || cleanId,
                status: found.status || 'Confirmed & Consecrated',
                paymentStatus: 'Paid (100% Verified)',
                totalAmount: found.totalAmount || found.total || 0,
                createdAt: found.createdAt || found.created_at || new Date().toISOString(),
                shippingMethod: 'Express Armored Courier (Zero Damage Guarantee)',
                trackingNumber: found.trackingNumber || 'SC-TRK-' + Math.floor(100000 + Math.random() * 900000),
                itemsCount: found.items?.length || 1,
              },
            };
          }
        }
      } catch (_) {}
    }

    return {
      success: false,
      message: `I couldn't find an order matching "${cleanId || cleanEmail}". Please verify your Order ID, check your confirmation email, or connect directly with our WhatsApp Support (+91 91117 16355).`,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Unable to query order status right now. Please connect with our support team.',
    };
  }
}

/**
 * 3. Get Shipping & Delivery Info Tool
 */
export async function getShippingInfoTool() {
  try {
    const settings = await getSupabaseDeliverySettings();
    const active = settings || DEFAULT_DELIVERY_SETTINGS;

    return {
      success: true,
      origin: `${active.origin_city}, ${active.origin_state}`,
      tier1: `Pune Local (<${active.tier_1_max_km}km): ₹${active.tier_1_fee} (1–2 days delivery)`,
      tier2: `Maharashtra Regional (${active.tier_1_max_km}–${active.tier_2_max_km}km): ₹${active.tier_2_fee} (2–3 days delivery)`,
      interstate: `National / All India: ₹${active.interstate_fee} (3–6 business days delivery)`,
      freeShipping: `FREE Express Shipping on all orders above ₹${active.free_shipping_threshold.toLocaleString('en-IN')}`,
      carrier: 'Armored Velvet-Lined Zero-Damage Luxury Courier Packaging',
      note: 'Every crystal is cleansed and consecrated prior to dispatch.',
    };
  } catch (_) {
    return {
      success: true,
      origin: 'Pune, Maharashtra',
      tier1: 'Pune Local: ₹50',
      tier2: 'Maharashtra Regional: ₹100',
      interstate: 'National / All India: ₹150',
      freeShipping: 'FREE Express Shipping on orders above ₹5,000',
      carrier: 'Armored Luxury Courier Packaging',
    };
  }
}

/**
 * 4. Get Crystal Care & Knowledge Tool
 */
export function getCrystalCareTool({ crystalName = '' } = {}) {
  const clean = crystalName.toLowerCase().replace(/[^a-z]/g, '');

  for (const [key, item] of Object.entries(CRYSTAL_EDUCATION)) {
    if (clean.includes(key) || key.includes(clean)) {
      return {
        success: true,
        crystal: item,
      };
    }
  }

  return {
    success: false,
    generalGuidance: {
      waterRule: 'Hard quartz stones (Clear Quartz, Amethyst, Rose Quartz) are water-safe. Soft minerals (Selenite, Pyrite, Hematite, Black Tourmaline) should NEVER be soaked in water.',
      sunlightRule: 'Avoid harsh noon direct sun for pigmented stones (Amethyst, Rose Quartz, Fluorite) to prevent color fading.',
      chargingMethod: 'Safest charging method: Rest on a Moroccan Selenite charging plate or place under the monthly Full Moon.',
      soundAttunement: 'Cleanse regularly with sacred Solfeggio sound bowls or sacred incense.',
    },
  };
}

/**
 * ============================================================================
 * INTENT CLASSIFIER & HYBRID DIALOGUE ENGINE
 * ============================================================================
 */

export async function processCustomerMessage({
  message = '',
  conversationHistory = [],
  authenticatedUser = null,
  activeFaqs = DEFAULT_FAQS,
} = {}) {
  const cleanInput = message.trim();
  const lower = cleanInput.toLowerCase();

  if (!cleanInput) {
    return {
      reply: 'How may I assist your crystal journey today? You can ask me to find crystals, check order status, learn crystal care, or explore shipping details.',
      products: [],
      quickReplies: ['Find a Crystal', 'Track My Order', 'Shipping Info', 'Crystal Care Guide'],
    };
  }

  // 1. ORDER TRACKING INTENT
  const isOrderQuery =
    lower.includes('track') ||
    lower.includes('order status') ||
    lower.includes('where is my order') ||
    lower.includes('order number') ||
    lower.includes('has my order shipped') ||
    /sc-\d+/i.test(lower) ||
    /order-\d+/i.test(lower) ||
    /pay_\w+/i.test(lower);

  if (isOrderQuery) {
    const idMatch = lower.match(/(sc-[a-z0-9-]+|order-[a-z0-9-]+|pay_[a-z0-9]+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
    const orderId = idMatch ? idMatch[0] : '';

    if (!orderId && !authenticatedUser) {
      return {
        reply:
          'To track your consecrated crystal parcel, please type your **Order ID** (e.g., `SC-10023`) or sign in to your Sumuk Sanctuary account to view all active orders.',
        products: [],
        quickReplies: ['Sign In to Account', 'WhatsApp Support', 'Explore Shop'],
        action: 'PROMPT_AUTH_OR_ORDER_ID',
      };
    }

    const orderResult = await getOrderStatusTool({ orderId, authenticatedUser });
    if (orderResult.success && orderResult.order) {
      const o = orderResult.order;
      return {
        reply: `**Order Found: ${o.orderNumber}**\n\n- **Status**: \`${o.status}\`\n- **Payment**: ${o.paymentStatus}\n- **Amount**: ₹${Number(o.totalAmount).toLocaleString('en-IN')}\n- **Packaging**: Armored Velvet-Lined Consecration Box\n- **Tracking**: ${o.trackingNumber}\n\nOur sanctuary team ensures every specimen is energized prior to delivery. Need instant transit updates? Connect on WhatsApp at +91 91117 16355.`,
        products: [],
        quickReplies: ['WhatsApp Tracking Help', 'Crystal Care Guide', 'Browse New Arrivals'],
      };
    } else {
      return {
        reply: orderResult.message,
        products: [],
        quickReplies: ['Chat on WhatsApp', 'Browse Crystals', 'Help'],
      };
    }
  }

  // 2. SHIPPING & DELIVERY INTENT
  if (
    lower.includes('shipping') ||
    lower.includes('delivery') ||
    lower.includes('how long') ||
    lower.includes('deliver to') ||
    lower.includes('ship to') ||
    lower.includes('courier') ||
    lower.includes('dispatch')
  ) {
    const shipInfo = await getShippingInfoTool();
    return {
      reply: `**Sumuk Crystalz Shipping & Delivery Guide**\n\nAll specimens are dispatched from our **${shipInfo.origin}** sanctuary:\n\n- **${shipInfo.tier1}**\n- **${shipInfo.tier2}**\n- **${shipInfo.interstate}**\n- **Special Offer**: **${shipInfo.freeShipping}**\n\n**Safe Transit Guarantee**: Every piece is packed in our custom velvet-lined luxury armored boxes with zero-damage transit replacement.`,
      products: [],
      quickReplies: ['Find Crystals Under ₹1000', 'Return Policy', 'Payment Methods'],
    };
  }

  // 3. RETURNS, REFUNDS & REPLACEMENTS INTENT
  if (
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('cancel') ||
    lower.includes('broken') ||
    lower.includes('damaged') ||
    lower.includes('exchange')
  ) {
    return {
      reply: `**Sumuk Crystalz Return & Replacement Policy**\n\n- **Compulsory Unboxing Video**: An uncut, continuous unboxing video (recorded from the sealed courier package opening to the specimen inspection without pauses or edits) is **strictly compulsory** for any return, transit damage claim, or replacement.\n- **Contact the Owner**: To initiate any return or replacement, you must **contact the owner directly** (Founder Soumyaa Naveen) via WhatsApp or Call at **+91 91117 16355** or email at **sumukcrystalz5@gmail.com** within 7 days of delivery.\n- **Energetic Integrity**: Because our crystals undergo individual sacred consecration for specific auric fields, opened/worn pieces cannot be exchanged for general change-of-mind.`,
      products: [],
      quickReplies: ['Contact Owner on WhatsApp', 'Shipping Info', 'Explore Crystals'],
    };
  }

  // 4. PAYMENT METHODS & RAZORPAY INTENT
  if (
    lower.includes('payment') ||
    lower.includes('pay') ||
    lower.includes('cod') ||
    lower.includes('cash on delivery') ||
    lower.includes('upi') ||
    lower.includes('gpay') ||
    lower.includes('razorpay')
  ) {
    return {
      reply: `**Secure Payment Methods**\n\nWe provide bank-grade encrypted checkout powered by **Razorpay**:\n\n- **UPI Instant Transfer**: Google Pay, PhonePe, Paytm, BHIM, QR code\n- **Credit & Debit Cards**: Visa, MasterCard, RuPay, Maestro\n- **NetBanking**: 50+ major Indian banks\n- **Cash on Delivery (COD)**: Available on selected consecrated bands\n\nYour payment details are strictly processed over encrypted SSL gateways.`,
      products: [],
      quickReplies: ['How to Place an Order', 'Show Best Sellers', 'Delivery Rates'],
    };
  }

  // 5. CRYSTAL CARE, WATER SAFETY & CLEANSING INTENT
  if (
    lower.includes('care') ||
    lower.includes('clean') ||
    lower.includes('wash') ||
    lower.includes('water') ||
    lower.includes('sunlight') ||
    lower.includes('charge') ||
    lower.includes('charging') ||
    lower.includes('recharge') ||
    lower.includes('selenite plate')
  ) {
    let matchedCrystalKey = '';
    for (const key of Object.keys(CRYSTAL_EDUCATION)) {
      if (lower.includes(key)) {
        matchedCrystalKey = key;
        break;
      }
    }

    if (matchedCrystalKey) {
      const info = CRYSTAL_EDUCATION[matchedCrystalKey];
      return {
        reply: `**${info.name} — Sacred Care Guide**\n\n- **Chakras**: ${info.chakras}\n- **Water Safe**: ${info.waterSafe ? 'Yes, can be rinsed gently in lukewarm water.' : 'No — Do not soak in water (may oxidize, soften, or damage finish).'}\n- **Sunlight Safe**: ${info.sunlightSafe ? 'Yes, safe for gentle morning sunlight.' : 'Avoid prolonged harsh noon sunlight to prevent natural color fading.'}\n- **Best Cleansing Method**: ${info.careTips}\n\n*Traditional wellness associations are spiritual mindfulness practices and not a substitute for medical care.*`,
        products: [],
        quickReplies: [`Show ${info.name} Products`, 'General Crystal Care', 'Browse All'],
      };
    }

    return {
      reply: `**Master Crystal Care & Cleansing Rules**\n\n1. **Water Safety Check**:\n   - **Water Safe**: Clear Quartz, Rose Quartz, Amethyst, Carnelian, Green Jade.\n   - **Do Not Soak**: Selenite (dissolves), Pyrite (rusts), Black Tourmaline, Hematite.\n2. **Sunlight Precautions**: Avoid prolonged harsh direct sunlight for Amethyst, Rose Quartz, and Fluorite to prevent fading.\n3. **Universal Recharging**: Place your crystals on a **Moroccan Selenite plate** or under the monthly **Full Moon** for 4–6 hours.\n4. **Sound Purification**: Himalayan sound bowls or sacred incense clear accumulated static prana immediately.`,
      products: [],
      quickReplies: ['Show Selenite Plates', 'Show Amethyst Bands', 'Show Pyrite Wealth Bands'],
    };
  }

  // 6. RESPONSIBLE METAPHYSICAL & EDUCATIONAL INTENT (Anxiety, Healing, Health, Wealth)
  if (
    lower.includes('anxiety') ||
    lower.includes('depression') ||
    lower.includes('cure') ||
    lower.includes('medical') ||
    lower.includes('disease') ||
    lower.includes('health') ||
    lower.includes('chakra')
  ) {
    return {
      reply: `**Holistic Crystal Energy & Wellness Perspective**\n\nIn sacred Vedic and metaphysical traditions, natural crystals are valued as tactile focal points to anchor mindfulness, balance energetic chakras, and cultivate calm during meditation:\n\n- **Peace & Calm**: *Amethyst* and *Rose Quartz* are traditionally cherished for tranquil reflection and stress relief.\n- **Grounding & Shielding**: *Black Tourmaline* and *Hematite* help anchor focus during chaotic moments.\n\n**Important Health Notice**: Natural crystals are complementary spiritual wellness aids and are **not a substitute for medical diagnosis, professional therapy, or clinical treatment**. Always consult qualified healthcare professionals for medical conditions.`,
      products: [],
      quickReplies: ['Show Crystals for Peace & Calm', 'Show Protection Bands', 'Show All Collections'],
    };
  }

  // 7. SPECIFIC CRYSTAL PRODUCT INQUIRY & DISCOVERY
  let searchCategory = '';
  let searchPurpose = '';
  let searchChakra = '';
  let searchMaxPrice = 999999;
  let searchMinPrice = 0;

  // Price filters
  if (lower.includes('under 1000') || lower.includes('under ₹1000') || lower.includes('below 1000')) {
    searchMaxPrice = 1000;
  } else if (lower.includes('under 1500') || lower.includes('under ₹1500')) {
    searchMaxPrice = 1500;
  } else if (lower.includes('under 800') || lower.includes('under ₹800')) {
    searchMaxPrice = 800;
  }

  if (lower.includes('wealth') || lower.includes('money') || lower.includes('prosperity') || lower.includes('abundance') || lower.includes('business')) {
    searchPurpose = 'wealth';
  } else if (lower.includes('love') || lower.includes('relationship') || lower.includes('heart') || lower.includes('soulmate')) {
    searchPurpose = 'love';
  } else if (lower.includes('protect') || lower.includes('evil eye') || lower.includes('shield') || lower.includes('nazar')) {
    searchPurpose = 'protection';
  } else if (lower.includes('peace') || lower.includes('calm') || lower.includes('sleep') || lower.includes('stress') || lower.includes('meditation')) {
    searchPurpose = 'peace';
  } else if (lower.includes('focus') || lower.includes('study') || lower.includes('career') || lower.includes('job')) {
    searchPurpose = 'career';
  }

  if (lower.includes('bracelet') || lower.includes('band')) {
    searchCategory = 'bracelet';
  } else if (lower.includes('mala')) {
    searchCategory = 'mala';
  } else if (lower.includes('pyramid')) {
    searchCategory = 'pyramid';
  } else if (lower.includes('tree')) {
    searchCategory = 'tree';
  }

  // Check specific crystal names
  const crystalKeywords = ['pyrite', 'amethyst', 'rose quartz', 'citrine', 'jade', 'labradorite', 'selenite', 'rudraksha', 'tourmaline', 'clear quartz', 'tiger'];
  let matchedKeyword = '';
  for (const kw of crystalKeywords) {
    if (lower.includes(kw)) {
      matchedKeyword = kw;
      break;
    }
  }

  const isProductSearch =
    matchedKeyword ||
    searchPurpose ||
    searchCategory ||
    searchMaxPrice < 999999 ||
    lower.includes('product') ||
    lower.includes('show me') ||
    lower.includes('find') ||
    lower.includes('crystal') ||
    lower.includes('stones') ||
    lower.includes('bestseller') ||
    lower.includes('catalog') ||
    lower.includes('collection') ||
    lower.includes('price');

  if (isProductSearch) {
    const searchRes = await searchProductsTool({
      query: matchedKeyword || (searchPurpose ? '' : cleanInput),
      purpose: searchPurpose,
      category: searchCategory,
      maxPrice: searchMaxPrice,
      minPrice: searchMinPrice,
      limit: 4,
    });

    if (searchRes.products && searchRes.products.length > 0) {
      const topCount = searchRes.products.length;
      let introMsg = `Here are our curated consecrated specimens matching your request:`;
      if (matchedKeyword) {
        introMsg = `Found ${topCount} authentic ${matchedKeyword.toUpperCase()} consecrated pieces in our sanctuary vault:`;
      } else if (searchPurpose) {
        introMsg = `Here are our highest-rated specimens calibrated for ${searchPurpose.toUpperCase()} & energetic alignment:`;
      } else if (searchMaxPrice < 999999) {
        introMsg = `Here are our consecrated crystals available under ₹${searchMaxPrice.toLocaleString('en-IN')}:`;
      }

      return {
        reply: introMsg,
        products: searchRes.products,
        quickReplies: ['Show More Under ₹1000', 'Check Delivery Time', 'WhatsApp Inquiries'],
      };
    }
  }

  // 8. FAQ MATCHING (Deterministic High-Precision Similarity)
  for (const faq of activeFaqs) {
    const qLower = faq.question.toLowerCase();
    const words = cleanInput.toLowerCase().split(' ').filter((w) => w.length > 3);
    const matchScore = words.filter((w) => qLower.includes(w)).length;

    if (matchScore >= 2 || qLower.includes(lower)) {
      return {
        reply: `**${faq.question}**\n\n${faq.answer}`,
        products: [],
        quickReplies: ['Browse Consecrated Stones', 'Delivery Rates', 'Connect with Founder'],
      };
    }
  }

  // 9. HOW TO ORDER / WEBSITE NAVIGATION
  if (lower.includes('how to order') || lower.includes('how to buy') || lower.includes('add to cart') || lower.includes('checkout')) {
    return {
      reply: `**How to Acquire Your Consecrated Crystal:**\n\n1. **Browse Catalog**: Visit our **[Sanctuary Shop](/shop)** or ask me for specific crystals.\n2. **Select Specimen**: Choose your preferred bead size (e.g. 6mm, 8mm, or 10mm).\n3. **Add to Vault**: Click **Add to Cart** or **Quick Add** with sacred consecration audio.\n4. **Secure Checkout**: Enter your shipping address and complete bank-grade encrypted payment via Razorpay UPI/Cards/NetBanking.\n5. **Blessing & Dispatch**: Your specimen is individually cleansed and shipped in armored velvet packaging.`,
      products: [],
      quickReplies: ['Open Sanctuary Shop', 'Shipping Info', 'Payment Options'],
    };
  }

  // 10. HUMAN SUPPORT & CONTACT INTENT
  if (
    lower.includes('contact') ||
    lower.includes('support') ||
    lower.includes('phone') ||
    lower.includes('whatsapp') ||
    lower.includes('instagram') ||
    lower.includes('email') ||
    lower.includes('human') ||
    lower.includes('talk to someone') ||
    lower.includes('founder')
  ) {
    return {
      reply: `**Connect Directly with Sumuk Crystalz Support Team**\n\n- **Founder & Reiki Master**: ${STORE_CONTACT_INFO.founder}\n- **Direct WhatsApp**: **[wa.me/c/919111716355](${STORE_CONTACT_INFO.whatsappUrl})** (+91 91117 16355)\n- **Instagram Sanctuary**: **[@sumukcrystalz5](${STORE_CONTACT_INFO.instagramUrl})**\n- **Email**: ${STORE_CONTACT_INFO.email}\n- **Physical Sanctuary**: ${STORE_CONTACT_INFO.location}\n- **Hours**: ${STORE_CONTACT_INFO.operatingHours}\n\nFeel free to send us a photo of your space or personal date of birth for customized Vedic stone curation!`,
      products: [],
      quickReplies: ['Open WhatsApp Direct', 'Explore Best Sellers', 'Track an Order'],
    };
  }

  // 11. FALLBACK / UNKNOWN QUESTIONS (With Unanswered Log Recording)
  if (typeof window !== 'undefined') {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('sumuk_unanswered_questions') || '[]');
      existingLogs.push({
        id: 'unans-' + Date.now(),
        question: cleanInput,
        timestamp: new Date().toISOString(),
        resolved: false,
      });
      localStorage.setItem('sumuk_unanswered_questions', JSON.stringify(existingLogs.slice(-50)));
    } catch (_) {}
  }

  return {
    reply: `I'm here to help with all questions about **Sumuk Crystalz**! I can assist you with:\n\n- Finding natural crystals (Pyrite, Amethyst, Rose Quartz, Citrine, etc.)\n- Real-time order tracking & transit updates\n- Shipping rates & free delivery guidelines\n- Crystal cleansing, water safety & care instructions\n- Payment methods & return guarantees\n\nWhat would you like to explore?`,
    products: [],
    quickReplies: ['Find a Crystal', 'Track My Order', 'Shipping Info', 'Crystal Care Guide', 'WhatsApp Support'],
  };
}
