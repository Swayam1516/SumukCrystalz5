-- =========================================================================
-- SUMUK CRYSTALZ 5 — SACRED MODALITIES & SITE ANNOUNCEMENTS SUPABASE SCHEMA
-- SQL Editor: https://supabase.com/dashboard/project/cmsiounkoqpwjccczebk/sql
-- =========================================================================

-- 1. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    short_title TEXT,
    category TEXT DEFAULT 'readings',
    description TEXT,
    tagline TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 999,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'currently unavailable', 'coming soon')),
    duration TEXT DEFAULT '20–25 Minutes',
    format TEXT DEFAULT 'Remote Consultation',
    ideal_for TEXT,
    benefits JSONB DEFAULT '{}'::jsonb,
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

DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active announcements" ON public.site_announcements;
CREATE POLICY "Public can view active announcements" ON public.site_announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access services" ON public.services;
CREATE POLICY "Full access services" ON public.services FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access announcements" ON public.site_announcements;
CREATE POLICY "Full access announcements" ON public.site_announcements FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED 9 CANONICAL MODALITIES
INSERT INTO public.services (id, name, title, short_title, category, tagline, description, price, status, duration, format, ideal_for, benefits)
VALUES
    (
        'tarot-reading',
        'Tarot Card Reading',
        'Tarot Card Reading',
        'Tarot Reading',
        'readings',
        'Intuitive, personalized reading providing clarity, insight, and sacred guidance.',
        'Personalized intuitive Tarot card reading providing clarity and divine guidance into your situation. Delivered offline via personalized voice notes or typed reading on WhatsApp.',
        199.00,
        'available',
        'Per Question (Voice Audio / Text)',
        'Personalized WhatsApp Voice Notes or Written',
        'Anyone seeking divine clarity on questions, life crossroads, and intuitive perspective.',
        '{
            "badge": "Intuitive Guidance",
            "priceDisplay": "₹199 per Question",
            "keywords": ["₹199 per Question", "Personalized Voice Notes", "Intuitive Card Selection", "WhatsApp Audio Delivery", "Written Reading Option", "Pre-Payment Confirmed"],
            "pricingTiers": [
                {"name": "Single Question Reading", "price": "₹199", "details": "1 specific inquiry intuitively explored with personalized voice notes or typed reading on WhatsApp."},
                {"name": "2-Question Deep Dive", "price": "₹398", "details": "2 focused questions explored in-depth with tailored guidance, card spread insights, and audio messages."},
                {"name": "3-Question Comprehensive Inquiry", "price": "₹597", "details": "3 distinct questions covering different dimensions (career, love/relationships, spiritual alignment)."}
            ],
            "whatWeAnalyse": [
                "Intuitive card spread tailored specifically to the questions you explore",
                "Subconscious influences, emotional currents, and current energetic dynamics",
                "Clarity on obstacles, hidden blessings, and spiritual alignment",
                "Actionable perspective and sovereign empowerment for your next life steps"
            ],
            "howItWorks": [
                "Each question is ₹199. Decide the number of questions and make the pre-payment accordingly.",
                "After payment, share your name, basic details, location, and questions with us via WhatsApp.",
                "Your reading will be scheduled based on your appointment.",
                "The reading will be provided offline, through personalized voice messages/audio clips on WhatsApp.",
                "If you prefer, you may request a written/typed reading instead.",
                "Live online Tarot readings are not available."
            ],
            "detailsRequired": [
                "Full Name & Current Location",
                "Basic Personal Details",
                "Specific Questions you wish to explore (1 Question = ₹199 unit)",
                "Screenshot of payment confirmation"
            ],
            "importantNote": "✨ Please note: Your appointment is confirmed only after the payment is completed. The reading will be provided offline, through personalized voice messages/audio clips on WhatsApp (or typed on request). Live online Tarot readings are not available. Tarot is an intuitive guidance tool for clarity and self-reflection."
        }'::jsonb
    ),
    (
        'numerology-analysis',
        'Numerology Analysis',
        'Numerology Analysis',
        'Numerology',
        'readings',
        'Discover what your numbers reveal about your personality, strengths, challenges, and life patterns.',
        'Decode your Date of Birth & Name to reveal key traits, missing numbers, potential Raj Yog combinations, and customized energetic remedies discussed over a call.',
        999.00,
        'available',
        'Detailed Analysis + Call Discussion',
        'Dossier Delivered within 1 Working Day + 1-on-1 Call',
        'Seekers navigating personal growth, career crossroads, and life pattern discovery.',
        '{
            "badge": "Cosmic Blueprint",
            "priceDisplay": "₹999",
            "keywords": ["₹999 Complete Analysis", "Date of Birth & Name", "Raj Yog Combinations", "Missing Numbers Chart", "1-on-1 Call Discussion", "Favourable Remedies"],
            "pricingTiers": [
                {"name": "Complete Numerology Analysis", "price": "₹999", "details": "Full chart analysis covering DOB, Name, missing numbers, Raj Yog, and customized remedies + 1-on-1 call discussion within 1 working day."},
                {"name": "Name Correction / Change Session (Optional Add-On)", "price": "Separate Paid Session", "details": "Offered as a separate paid session based on the findings of your numerology analysis if spelling harmonization is required."}
            ],
            "whatWeAnalyse": [
                "Your Date of Birth and Name vibrational frequency",
                "Your key personality traits, innate gifts, and behavioral characteristics",
                "Your core strengths and weaker areas requiring energetic support",
                "Number patterns and missing numbers in your numerological grid",
                "Potential Raj Yog / favourable planetary & numerical combinations",
                "Areas where you may experience challenges or breakthrough opportunities",
                "Suitable remedies and ways to strengthen or activate favourable energies according to your numbers"
            ],
            "howItWorks": [
                "Book your Numerology Analysis by making the pre-payment of ₹999.",
                "Share your Name and Date of Birth and any required details via WhatsApp.",
                "Your numerology chart will be analysed in detail by Soumyaa Naveen.",
                "We will get back to you within 1 working day with the complete analysis.",
                "The findings and recommendations will then be discussed with you directly over a personalized call."
            ],
            "detailsRequired": [
                "Full Name currently in use",
                "Date of Birth (DD/MM/YYYY)",
                "Any specific questions or life focus areas (career, business, marriage, personal growth)",
                "Screenshot of payment confirmation"
            ],
            "importantNote": "💫 Please note: Name correction or name-change recommendations, if required, are not included in the ₹999 analysis. They are offered as a separate paid session, based on the findings of your numerology analysis. Numerology is intended as a spiritual and self-reflection tool to help you understand your patterns, strengths, and areas for personal growth."
        }'::jsonb
    ),
    (
        'aura-checking',
        'Aura Checking & 7-Chakra Analysis',
        'Aura Checking & 7-Chakra Analysis',
        'Aura & Chakras',
        'readings',
        'Understand the current condition of your auric field and seven chakras through intuitive L-Rod analysis.',
        'Assess the overall strength of your auric field and seven major chakras from Muladhara to Sahasrara using intuitive L-Rod biofield scanning.',
        777.00,
        'available',
        '20 – 25 Minutes',
        'Recorded Video (Offline) OR Live Video Call (Online)',
        'Individuals feeling drained, scattered, or looking to map their subtle biofield.',
        '{
            "badge": "L-Rod Biofield Scan",
            "priceDisplay": "Offline: ₹777 • Live Online: ₹999",
            "keywords": ["Offline Video: ₹777", "Live Online: ₹999", "L-Rod Analysis", "7 Major Chakras", "Recorded Video Proof", "Auric Strength Assessment"],
            "pricingTiers": [
                {"name": "🔮 Offline Aura Checking", "price": "₹777", "details": "Aura checked using L-Rods, recorded on video (~20–25 mins) and shared with you on WhatsApp with detailed insights into your biofield and 7 chakras."},
                {"name": "🌟 Live Online Aura Checking", "price": "₹999", "details": "Interactive real-time live online session with camera guidance at a convenient scheduled appointment slot."}
            ],
            "whatWeAnalyse": [
                "Muladhara (Root Chakra) – Stability, grounding, physical vitality",
                "Swadhisthana (Sacral Chakra) – Emotions, creativity, relationships",
                "Manipura (Solar Plexus) – Personal power, confidence, vitality digestion",
                "Anahata (Heart Chakra) – Love, compassion, emotional processing",
                "Vishuddha (Throat Chakra) – Authentic expression, communication truth",
                "Ajna (Third Eye Chakra) – Intuition, mental clarity, spiritual vision",
                "Sahasrara (Crown Chakra) – Spiritual connection, cosmic equilibrium",
                "Overall biofield radius, energetic boundary integrity, and subtle static"
            ],
            "howItWorks": [
                "Choose between Offline Recorded Checking (₹777) or Live Online Session (₹999).",
                "For Offline (₹777): Share Name, Date of Birth, Place of Birth, and a recent full-length photograph. Aura is checked using L-Rods, recorded on video (~20–25 mins), and shared with you.",
                "For Live Online (₹999): Pre-book your slot. A convenient time slot is scheduled where you join live with camera on.",
                "Receive actionable insights into your auric field and the condition of each chakra."
            ],
            "detailsRequired": [
                "Full Name",
                "Date of Birth (DD/MM/YYYY)",
                "Place of Birth",
                "Recent full-length photograph (showing head-to-toe posture)",
                "Payment confirmation screenshot"
            ],
            "importantNote": "✨ Important: Both options require pre-booking and advance payment. Chakra or aura healing/remedial sessions, if recommended after the analysis, are separate services. Aura and chakra analysis is offered as a spiritual and energy-based wellness practice and is intended for self-reflection and personal guidance."
        }'::jsonb
    ),
    (
        'crystal-consultation',
        'Basic Crystal Consultation',
        'Basic Crystal Consultation',
        'Crystal Consultation',
        'crystals',
        'Personalised 20-minute session to discover which crystals are right for your energy and intentions.',
        'Not sure which crystals are right for you? A personalized 20-minute phone consultation with Soumyaa Naveen to match authentic crystals to your exact intentions.',
        555.00,
        'available',
        '20 Minutes Call',
        'Direct 1-on-1 Phone Consultation Call',
        'Seekers wanting personalized gemstone pairing for wealth, protection, peace, or health.',
        '{
            "badge": "Personalized Matchmaking",
            "priceDisplay": "₹555",
            "keywords": ["₹555 Only", "20-Minute Call", "Crystal Matchmaking", "How to Wear & Cleanse", "Custom Remedies", "Direct Phone Guidance"],
            "pricingTiers": [
                {"name": "Basic Crystal Consultation Call", "price": "₹555", "details": "20-minute dedicated phone consultation to understand your requirements, identify suitable gemstones, and prescribe energetic usage protocols."}
            ],
            "whatWeAnalyse": [
                "✨ Which crystals are suitable for your specific energy and birth chart",
                "💎 How to wear or work with the recommended crystals (wrist, neck, pocket, altar)",
                "🌿 Crystal-based remedies according to your requirements and life goals",
                "🔮 How crystals may support your intentions and energy work",
                "🌸 Guidance on crystal cleansing, charging, sound attunement, and effective care"
            ],
            "howItWorks": [
                "Book your ₹555 Crystal Consultation by completing pre-payment.",
                "Share your contact number and brief background on what you want crystal guidance for.",
                "Our team coordinates a mutually convenient 20-minute time slot for the call.",
                "Receive clear, direct guidance on the ideal gemstones, wearing instructions, and intention activation."
            ],
            "detailsRequired": [
                "Full Name & Active WhatsApp / Calling Phone Number",
                "Date of Birth (optional, for planetary crystal alignment)",
                "Specific goals or challenges (wealth, evil eye protection, relationship harmony, health, stress relief)",
                "Payment confirmation screenshot"
            ],
            "importantNote": "✨ Book your ₹555 Crystal Consultation and discover the right crystals for your journey. Designed to give you simple, honest, and personalised crystal guidance based on your authentic needs without unnecessary complexity."
        }'::jsonb
    ),
    (
        'reiki-healing',
        'Distant Reiki & Aura Healing Session',
        'Distant Reiki & Aura Healing Session',
        'Reiki & Aura Healing',
        'energy',
        'A gentle energy-healing session for relaxation, energetic balance, and inner wellbeing.',
        'Gentle Usui Reiki energy healing for 7-chakra balancing, stress dissolution, and fatigue release. Available remotely or via live online video session.',
        777.00,
        'available',
        '20 – 25 Minutes',
        'Remote Distant Attunement OR Live Online Video Session',
        'Anyone feeling stressed, emotionally heavy, low in vitality, or needing energetic reset.',
        '{
            "badge": "Pranic Restoration",
            "priceDisplay": "Distant / Offline: ₹777 • Live Online: ₹999",
            "keywords": ["Distant Healing: ₹777", "Live Online: ₹999", "7 Chakras Balancing", "Stress & Fatigue Dissolution", "Negative Energy Support", "Subtle Field Reset"],
            "pricingTiers": [
                {"name": "🌙 Distant / Offline Reiki Healing", "price": "₹777", "details": "Performed remotely at the assigned scheduled time without video call (20–25 mins). Relax in a quiet space and receive divine pranic frequencies."},
                {"name": "🎥 Live Online Reiki Healing", "price": "₹999", "details": "Interactive live video session conducted online with camera on, guiding you through the energetic healing process in real time."}
            ],
            "whatWeAnalyse": [
                "🌈 Comprehensive Chakra and auric-field balancing",
                "✨ Transmutation of low, stagnant, or disturbed biofield energy",
                "🌿 Relief from stress, emotional heaviness, and mental fatigue",
                "🔮 Support when feeling energetically drained, scattered, or disconnected",
                "🧿 Support with negative, stagnant, or unwanted environmental energies",
                "💫 Releasing energetic blockages and restoring natural vitality flow",
                "🕊️ Deep parasympathetic relaxation and energetic rejuvenation"
            ],
            "howItWorks": [
                "Before the session, discuss what you are experiencing and share your requirements.",
                "Share your photograph, basic details, and specific concerns you want to work on.",
                "A suitable 20–25 minute healing session is scheduled.",
                "For Distant (₹777): Rest comfortably in a quiet place, phone on silent, be open and receptive.",
                "For Live (₹999): Be present with camera switched on at scheduled time for real-time guidance."
            ],
            "detailsRequired": [
                "Full Name & Contact Number",
                "Recent Photograph",
                "Basic information & location",
                "Specific concerns, emotional heaviness, or issues you wish to address",
                "Payment confirmation screenshot"
            ],
            "importantNote": "💫 Important Note: Energy healing is intended as a complementary spiritual wellness practice and is not a substitute for medical or psychological diagnosis or treatment. Your active participation, relaxation and willingness to receive the session helps create a meaningful experience."
        }'::jsonb
    ),
    (
        'psychic-surgery',
        'Psychic Surgery – Spiritual Energy Healing',
        'Psychic Surgery – Spiritual Energy Healing',
        'Psychic Surgery',
        'energy',
        'A deep spiritual healing session focused on energetic blockages, inner release, and restoring balance.',
        'Non-invasive spiritual energy surgery utilizing sacred symbols, focused intention, and Reiki to dissolve stagnant etheric cysts and emotional blockages.',
        999.00,
        'available',
        '30 – 35 Minutes',
        'Remote Distant Session OR Live Zoom / WhatsApp Video',
        'Those seeking profound spiritual release of long-standing emotional patterns and stagnant blockages.',
        '{
            "badge": "Advanced Etheric Extraction",
            "priceDisplay": "Distant: ₹999 • Live Online: ₹1,200",
            "keywords": ["Distant Session: ₹999", "Live Online: ₹1,200", "Etheric Blockage Release", "Spiritual Healing Symbols", "Emotional Trauma Clearing", "30–35 Minute Depth"],
            "pricingTiers": [
                {"name": "🌙 Distant Psychic Surgery", "price": "₹999", "details": "Conducted remotely without a live video call (~30–35 mins). Rest peacefully in a quiet space while practitioner directs spiritual symbols and healing prana."},
                {"name": "🎥 Live Online Psychic Surgery", "price": "₹1,200", "details": "Conducted live via Zoom or WhatsApp video call (~30–35 mins) with real-time practitioner guidance throughout the spiritual healing process."}
            ],
            "whatWeAnalyse": [
                "🌈 Chakra and auric-field deep energetic balancing",
                "💫 Long-standing emotional patterns, stagnant grief, and unresolved trauma",
                "🕊️ Sensations of heaviness, etheric stagnation, or localized energetic discomfort",
                "✨ Perceived energetic blockages in particular chakras or body areas",
                "🔮 Releasing unwanted energetic cords and restoring sovereign inner balance"
            ],
            "howItWorks": [
                "Before booking, discuss your concerns and the areas you would like to focus on.",
                "Share a recent photograph and brief description through WhatsApp text or audio message.",
                "The session lasts approximately 30–35 minutes.",
                "For Distant (₹999): Rest in a quiet, comfortable space with phone on silent. Simply relax comfortably.",
                "For Live (₹1,200): Join Zoom/WhatsApp video with stable internet in a quiet room with camera on."
            ],
            "detailsRequired": [
                "Full Name",
                "Recent Photograph",
                "Brief description of concerns or stagnation through WhatsApp text or audio message",
                "Payment confirmation screenshot"
            ],
            "importantNote": "📌 Important: Psychic surgery is a complementary spiritual wellness practice, not a physical operation or a substitute for medical or psychological care. It cannot guarantee the removal of trauma, negative energies, or physical symptoms. Please continue prescribed medical treatment and seek professional care when needed."
        }'::jsonb
    ),
    (
        'mobile-numerology',
        'Mobile Number Numerology Analysis & Correction',
        'Mobile Number Numerology Analysis & Correction',
        'Mobile Numerology',
        'readings',
        'Discover the numerological significance of your mobile number and receive personalised guidance for your next step.',
        'Analyse the numerical vibrations of your mobile number in career, finance, and opportunities, or receive customized recommendations for a new auspicious number.',
        750.00,
        'available',
        'Detailed Audio / Video Dossier',
        'Personalized Audio Message or Video Recording (Remote)',
        'Anyone looking to optimize their primary phone number for business, career, or personal vibration.',
        '{
            "badge": "Digital Vibration",
            "priceDisplay": "Analysis: ₹750 • Correction: ₹750 • Complete: ₹1,500",
            "keywords": ["Existing Analysis: ₹750", "New Correction: ₹750", "Complete Package: ₹1500", "Career & Financial Impact", "Audio / Video Delivery", "Aligned with DOB"],
            "pricingTiers": [
                {"name": "🔢 1. Mobile Number Analysis", "price": "₹750", "details": "Focuses on your existing, regularly used mobile number. Covers numerical significance, strengths, challenges, and traditional interpretations delivered via audio or video recording."},
                {"name": "✨ 2. Mobile Number Correction & Recommendation", "price": "₹750", "details": "Personalised mobile number recommendations and guidance on choosing an auspicious new number aligned with your name and birth chart."},
                {"name": "💎 3. Complete Package (Analysis + Correction)", "price": "₹1,500", "details": "Both services bundled together: deep analysis of existing mobile number + tailored recommendations for new auspicious numbers."}
            ],
            "whatWeAnalyse": [
                "Numerological total and compound frequency of your mobile number",
                "Potential strengths and challenges associated with its repeating number patterns",
                "Traditional interpretations across career, finance, relationships, and business",
                "Compatibility between your mobile number vibration and your Date of Birth",
                "Specific recommendations for choosing a high-frequency replacement number"
            ],
            "howItWorks": [
                "Select your service (Analysis ₹750, Correction ₹750, or Complete Package ₹1,500).",
                "Complete pre-payment and share your Name, DOB, Birth Time, and existing mobile number.",
                "Your analysis is prepared and delivered through a personalized audio message or video recording.",
                "This service is delivered remotely; no live consultation is required."
            ],
            "detailsRequired": [
                "Full Name",
                "Date of Birth (DD/MM/YYYY)",
                "Birth Time (if known)",
                "Existing mobile number you regularly use",
                "Payment confirmation screenshot"
            ],
            "importantNote": "📌 Advance booking is required. The service is delivered remotely via personalized audio or video recording; no live session is included. Numerology is a spiritual and traditional interpretive practice; its readings are not scientifically established predictors of life outcomes."
        }'::jsonb
    ),
    (
        'vehicle-numerology',
        'Vehicle Number Numerology Analysis',
        'Vehicle Number Numerology Analysis',
        'Vehicle Numerology',
        'readings',
        'Choose your vehicle number mindfully. Drive with confidence and awareness.',
        'Select an auspicious new vehicle number or evaluate your existing vehicle registration with numerology-based remedies for smoother journeys.',
        750.00,
        'available',
        'Complete Numerology Report + Guidance',
        'Personalized WhatsApp Audio/PDF Report',
        'Vehicle owners purchasing new vehicles or seeking protective alignment for current cars/bikes.',
        '{
            "badge": "Mindful Vehicle Selection",
            "priceDisplay": "New Selection: ₹750 • Existing: ₹750 • With Remedies: ₹999",
            "keywords": ["New Selection: ₹750", "Existing Analysis: ₹750", "With Remedies: ₹999", "Accident & Repair Mitigation", "Owner DOB Compatibility", "Drive with Confidence"],
            "pricingTiers": [
                {"name": "1. New Vehicle Number Selection", "price": "₹750", "details": "Planning to purchase a new vehicle? Share your shortlisted options or receive recommended favourable numbers based on your numerological profile."},
                {"name": "2. Existing Vehicle Number Analysis", "price": "₹750", "details": "Already own a vehicle? Get your current vehicle number analysed to understand its compatibility with the owner and recommendations for improvement."},
                {"name": "3. Vehicle Number Analysis with Remedies", "price": "₹999", "details": "Full vehicle number analysis plus recommended numerology-based remedies for less favourable numbers (crystal hangers/protection stones charged separately)."}
            ],
            "whatWeAnalyse": [
                "Single digit and compound numerology total of vehicle registration plates",
                "Compatibility between vehicle number vibration and the registered owner’s Date of Birth",
                "Underlying energetic patterns associated with repeated repairs, unexpected expenses, or stress",
                "Recommended lucky number combinations for upcoming RTO registrations",
                "Protective remedies and sacred crystal pairings for travel harmony"
            ],
            "howItWorks": [
                "Choose your package (New Selection ₹750, Existing Analysis ₹750, or Analysis with Remedies ₹999).",
                "Make pre-payment and share the vehicle & owner details via WhatsApp.",
                "Our team evaluates the vibrational resonance and delivers comprehensive guidance.",
                "If crystal remedies (crystal hanger, vehicle protection stone) are recommended, they can be curated and dispatched from our vault."
            ],
            "detailsRequired": [
                "Vehicle number (existing number or optional shortlisted choices)",
                "Vehicle owner’s full name (as per official RC / identity documents)",
                "Date of Birth of owner (DD/MM/YYYY)",
                "Specific concerns (repeated repairs, unexpected expenses, previous accidents)",
                "Vehicle details (make, model, two-wheeler or four-wheeler)",
                "Payment confirmation screenshot"
            ],
            "importantNote": "📩 Choose with awareness. Drive with confidence. If any additional treatment is recommended (such as a crystal hanger, vehicle protection stone, or personalised crystal), it will be charged and dispatched separately."
        }'::jsonb
    ),
    (
        'name-numerology',
        'Name Numerology Analysis & Name Correction',
        'Name Numerology Analysis & Name Correction',
        'Name Numerology',
        'readings',
        'Your name is an important part of your identity. Align your name vibration with your life goals.',
        'Analyse your existing name vibrations or receive personalized spelling corrections that preserve familiar pronunciation while activating auspicious life frequencies.',
        750.00,
        'available',
        'Comprehensive Dossier & Spelling Options',
        'Personalized Analysis + Multiple Spelling Options Report',
        'Individuals seeking personal reinvention, career elevation, or harmonious life vibrations.',
        '{
            "badge": "Identity Vibration",
            "priceDisplay": "Analysis: ₹750 • Correction: ₹750 • Complete: ₹1,500",
            "keywords": ["Name Analysis: ₹750", "Name Correction: ₹750", "Complete Package: ₹1500", "Preserves Pronunciation", "Multiple Spelling Choices", "Professional & Personal Growth"],
            "pricingTiers": [
                {"name": "1. Existing Name Analysis", "price": "₹750", "details": "Analysis of your current name and its numerological values, compatibility with your Date of Birth, and identifying potential vibrational imbalances."},
                {"name": "2. Name Correction", "price": "₹750", "details": "Personalised name correction suggestions with multiple spelling options, designed to preserve your familiar pronunciation as far as possible."},
                {"name": "3. Complete Name Analysis & Correction Package", "price": "₹1,500", "details": "Get both services together: comprehensive existing name analysis, compatibility assessment, and personalized name correction options."}
            ],
            "whatWeAnalyse": [
                "Chaldean and Pythagorean numerological values of each letter in your name",
                "Compatibility between your First Name, Full Name, and Date of Birth",
                "Soul Urge, Expression, and Personality number alignments",
                "Vibrational friction affecting career momentum, business recognition, or relationships",
                "Auspicious letter adjustments that preserve natural pronunciation while elevating chart strength"
            ],
            "howItWorks": [
                "Select your package (Analysis ₹750, Correction ₹750, or Complete Package ₹1,500).",
                "Make pre-payment and share your current name, pronunciation, and birth details.",
                "Soumyaa Naveen analyses the chart and calculates auspicious spelling harmonizations.",
                "Receive multiple spelling options and detailed instructions on signature usage and documents."
            ],
            "detailsRequired": [
                "Full name currently in use",
                "Date of birth (DD/MM/YYYY)",
                "Name pronunciation (if not obvious from spelling)",
                "Preferred name or spelling options (if any)",
                "Main area of focus (career, business, relationships, finances, personal growth)",
                "Payment confirmation screenshot"
            ],
            "importantNote": "Note: Numerology is a belief-based practice. Name changes cannot guarantee specific outcomes in career, relationships, finances, health, or other areas of life. Any correction is a personal choice and should be considered alongside practical factors."
        }'::jsonb
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    short_title = EXCLUDED.short_title,
    category = EXCLUDED.category,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    duration = EXCLUDED.duration,
    format = EXCLUDED.format,
    ideal_for = EXCLUDED.ideal_for,
    benefits = EXCLUDED.benefits,
    updated_at = NOW();

-- 5. SEED INITIAL ANNOUNCEMENT
INSERT INTO public.site_announcements (id, message, is_active, updated_at)
VALUES (
    'global_announcement',
    '✨ Holy Navaratri Blessing: Complimentary Vedic 432Hz Sound Attunement on All Crystal Vault Orders with Code SUMUK108',
    true,
    NOW()
)
ON CONFLICT (id) DO NOTHING;
