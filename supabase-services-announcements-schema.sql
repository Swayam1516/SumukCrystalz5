-- =========================================================================
-- SUMUK CRYSTALZ 5 — SERVICES & SITE ANNOUNCEMENTS SUPABASE SCHEMA
-- SQL Editor: https://supabase.com/dashboard/project/cmsiounkoqpwjccczebk/sql
-- =========================================================================

-- 1. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    short_title TEXT,
    category TEXT DEFAULT 'energy',
    description TEXT,
    tagline TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 1500,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'currently unavailable', 'coming soon')),
    duration TEXT DEFAULT '60 Minutes',
    format TEXT DEFAULT 'Remote Zoom / Sanctuary In-Person',
    ideal_for TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SITE ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.site_announcements (
    id TEXT PRIMARY KEY DEFAULT 'global_announcement',
    message TEXT NOT NULL DEFAULT '✨ Holy Navaratri Blessing: Complimentary Vedic 432Hz Sound Attunement on All Crystal Vault Orders with Code SUMUK108',
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_announcements ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view services" 
    ON public.services FOR SELECT 
    USING (true);

CREATE POLICY "Public can view active announcements" 
    ON public.site_announcements FOR SELECT 
    USING (true);

-- Allow full access for anon/service_role
CREATE POLICY "Full access services" 
    ON public.services FOR ALL 
    USING (true) WITH CHECK (true);

CREATE POLICY "Full access announcements" 
    ON public.site_announcements FOR ALL 
    USING (true) WITH CHECK (true);

-- 4. SEED CANONICAL SERVICES
INSERT INTO public.services (id, name, title, short_title, category, tagline, description, price, status, duration, format, ideal_for, benefits)
VALUES
    (
        'reiki-master',
        'Reiki Mastership & Energy Attunement',
        'Reiki Mastership & Energy Attunement',
        'Reiki Master',
        'energy',
        'Universal Life-Force Attunement & Pranic Vitality Flow',
        'Experience deep energetic restorative healing channeled by Usui Reiki Master Soumyaa Naveen. This high-frequency attunement cleanses the meridians, revitalizes depleted chakras, and aligns mind, body, and spirit into divine equilibrium.',
        3500.00,
        'available',
        '60–75 Minutes',
        'Remote Zoom / Sanctuary In-Person',
        'Anyone seeking profound inner peace, emotional equilibrium, or energetic rejuvenation.',
        '["Comprehensive 7-Chakra balancing & vibrational attunement", "Accelerates natural physical, mental, and emotional recovery", "Dissolves accumulated chronic stress, fatigue, and nervous exhaustion", "Distance Reiki sessions with identical quantum resonance worldwide"]'::jsonb
    ),
    (
        'aura-checking',
        'Aura Checking & Biofield Scanning',
        'Aura Checking & Biofield Scanning',
        'Aura Checking',
        'readings',
        '7-Layer Subtle Body Analysis & Electromagnetic Cleansing',
        'An intuitive diagnostic scanning of your auric biofield layers. Soumyaa identifies energetic tears, heavy static accumulations, stagnant emotional debris, and external energetic leaks before performing a deep auric sealing.',
        2500.00,
        'available',
        '45 Minutes',
        'Remote Photo Analysis + Live Voice Consult',
        'Empaths, healers, or individuals feeling drained, scattered, or susceptible to external vibes.',
        '["Detailed diagnostic breakdown of your current auric dominant colors", "Identification of etheric leaks, energy drains, and boundary fissures", "Energetic smudge, sound-bath alignment, and auric protective seal", "Actionable crystal & frequency recommendations for long-term shielding"]'::jsonb
    ),
    (
        'numerology',
        'Sacred Numerology & Destiny Blueprint',
        'Sacred Numerology & Destiny Blueprint',
        'Numerology',
        'readings',
        'Life Path, Soul Urge & Karmic Destiny Guidance',
        'Decode the vibrational mathematics of your birth date and sacred name. Uncover your inherent Soul Urge, Destiny Number, karmic cycles, and auspicious timing windows for career, wealth, and spiritual growth.',
        2100.00,
        'available',
        'Dossier + 30 Min Q&A',
        'Detailed Personalized PDF Dossier + Voice Note Consultation',
        'Individuals navigating major life decisions, career pivots, or seeking profound self-knowledge.',
        '["Comprehensive Life Path, Expression & Soul Urge calculation", "Current Personal Year cycle forecasting & auspicious transition dates", "Name vibration harmonization & resonance alignment", "Custom gemstone & frequency pairings tuned to your core numbers"]'::jsonb
    ),
    (
        'tarot-readings',
        'Intuitive Tarot Readings & Guidance',
        'Intuitive Tarot Readings & Guidance',
        'Tarot Readings',
        'readings',
        'Archetypal Wisdom, Intuitive Foresight & Life Alignment',
        'Connect with higher spiritual guidance through sacred intuitive tarot spreads. Soumyaa channels lucid insights into love, purpose, relationships, and upcoming crossroads with compassionate accuracy.',
        1800.00,
        'available',
        '45–60 Minutes',
        '1-on-1 Video Session / Voice Memo + Photo Spread',
        'Anyone seeking immediate perspective on crossroads, relationship questions, or life transitions.',
        '["Multi-card Celtic Cross, Chakra, or bespoke inquiry spreads", "Direct clarity on recurring karmic patterns and hidden opportunities", "Empowering guidance focused on sovereign free will and alignment", "High-resolution photo spread provided alongside session recording"]'::jsonb
    ),
    (
        'crystal-therapy',
        'Crystal Therapy & Resonant Attunement',
        'Crystal Therapy & Resonant Attunement',
        'Crystal Therapy',
        'crystals',
        'Piezo-Electric Harmonic Frequencies for Cellular Balance',
        'Harness the natural electromagnetic oscillation of master crystals placed upon the body’s key energetic vortices. This therapy balances biological frequencies, releases trapped trauma, and infuses your auric matrix with harmonic stillness.',
        3000.00,
        'available',
        '60 Minutes',
        'Sanctuary In-Person / Quantum Crystal Grid Distance Session',
        'Those with physical tension, chakra imbalances, or seeking immersive mineral attunement.',
        '["Precision gemstone placement according to individual chakra imbalances", "Infusion of high-frequency crystalline piezoelectric vibrations", "Deep parasympathetic nervous system relaxation and stress dissolution", "Synergistic pairing with Solfeggio sound bowls and sacred herbs"]'::jsonb
    ),
    (
        'psychic-surgery',
        'Psychic Surgery & Etheric Cord Cutting',
        'Psychic Surgery & Etheric Cord Cutting',
        'Psychic Surgery',
        'energy',
        'Energetic Extraction & Toxic Attachment Severing',
        'A powerful non-invasive etheric intervention designed to extract deep-seated emotional toxins, calcified blockages, and toxic cords of attachment. Soumyaa gently removes stagnant energetic implants and seals the etheric body.',
        4500.00,
        'available',
        '60–75 Minutes',
        'High-Frequency Distance / Sanctuary In-Person',
        'Individuals feeling bound by past relationships, unexplained heavy fatigue, or deep psychic baggage.',
        '["Surgical severing of energy-draining cords from past relationships or trauma", "Etheric extraction of stagnant emotional cysts and energetic debris", "Golden light sealing and auric membrane reinforcement", "Rapid sensation of lightness, unburdened clarity, and restored sovereignty"]'::jsonb
    ),
    (
        'energy-healing',
        'Energy Healing & Blockage Removal',
        'Energy Healing & Blockage Removal',
        'Energy Healing & Blockages',
        'energy',
        'Pranic Unblocking, Meridian Flow & Somatic Release',
        'Clear stagnant emotional and energetic dams across your subtle anatomy. By dissolving subconscious blockages, this modality restores natural life-force circulation (prana/chi) and re-ignites your vibrant enthusiasm.',
        2800.00,
        'available',
        '60 Minutes',
        'Remote Live Session / In-Person Sanctuary',
        'People feeling stuck, stagnant in career or creativity, or experiencing prolonged emotional heaviness.',
        '["Gentle yet profound clearing of energetic stagnation in key meridians", "Releases unexpressed emotional grief, anger, and anxiety stored somatically", "Restores optimal prana circulation throughout the entire endocrine matrix", "Includes grounding aftercare protocol and breathwork exercises"]'::jsonb
    ),
    (
        'reiki-infused-products',
        'Reiki-Infused Crystal Products',
        'Reiki-Infused Crystal Products',
        'Reiki-Infused Products',
        'crystals',
        'Personally Charged & 528Hz Sound-Attuned Minerals',
        'Every crystal specimen, gemstone bracelet, and altar geode offered under this collection is personally cleansed, consecrated, and infused with Usui Reiki intention by Soumyaa Naveen before dispatch.',
        1200.00,
        'available',
        'Immediate Dispatch from Vault',
        'Insured Luxury Delivery Worldwide',
        'Collectors, seekers, and gift-givers wanting crystals with alive, positive, high-vibration energy.',
        '["Sound-cleansed with 528 Hz Himalayan singing bowls and white sage/sandalwood", "Infused with customized healing intentions (Protection, Wealth, Harmony, Intuition)", "Accompanied by a signed Consecration Certificate and activation ritual guide", "Ready to place immediately in your altar or wear as an energetic shield"]'::jsonb
    ),
    (
        'customized-crystal-orders',
        'Customized Crystal Orders & Bespoke Curation',
        'Customized Crystal Orders & Bespoke Curation',
        'Customized Crystal Orders',
        'crystals',
        'Personalized Altar Grids, Bespoke Jewelry & Space Attunement',
        'Collaborate directly with Soumyaa Naveen to curate a tailored crystal collection, customized gemstone jewelry piece, or sacred geometric grid designed exclusively for your astrological chart, home sanctuary, or office.',
        5000.00,
        'available',
        'Tailored Timeline & Worldwide Shipping',
        'Private Consultation + Bespoke Crafting',
        'Anyone desiring bespoke gemstone jewelry, rare collector specimens, or home energy grid setups.',
        '["1-on-1 crystal matchmaking tailored to your astrological birth chart and intentions", "Custom handcrafted wire-wrapped gemstone pendants and intention bracelets", "Architectural geode selection for luxury homes, studios, and corporate lobbies", "Complete energetic blueprint and geometric layout instructions included"]'::jsonb
    )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED INITIAL ANNOUNCEMENT
INSERT INTO public.site_announcements (id, message, is_active, updated_at)
VALUES (
    'global_announcement',
    '✨ Holy Navaratri Blessing: Complimentary Vedic 432Hz Sound Attunement on All Crystal Vault Orders with Code SUMUK108',
    true,
    NOW()
)
ON CONFLICT (id) DO NOTHING;
