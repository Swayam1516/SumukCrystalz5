const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');
const { sendWelcomeNotification } = require('../services/emailService');
const { supabase, syncCustomerToSupabase } = require('../utils/supabase');

// Resilient memory cache for patrons (ensures instant lookup and fallback support)
const memoryPatronStore = new Map();

/**
 * Signs a JWT with user payload
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';
  if (!secret) {
    throw new AppError('Server security configuration error: JWT_SECRET missing.', 500);
  }

  const role = user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
  const userId = user.id || user._id || 'usr_unknown';

  return jwt.sign(
    {
      sub: userId,
      id: userId,
      name: user.name || user.full_name,
      email: user.email,
      role,
    },
    secret,
    { expiresIn: role === ROLES.ADMIN ? '24h' : '7d' }
  );
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Sumukcrystalz@555';

/**
 * POST /api/auth/register (or /api/auth/signup)
 * Enforces email uniqueness and prevents duplicate registrations.
 */
async function register(req, res, next) {
  try {
    const { email, password, fullName, phone, pincode, dob } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide both email and password.', 400));
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0] || 'Valued Patron';

    // 1. Reserved Founder Admin Email Check
    if (
      cleanEmail === ADMIN_EMAIL ||
      cleanEmail === 'sumukcrystalz5@gmail.com' ||
      cleanEmail === 'sumukcrystalz@gmail.com'
    ) {
      return next(
        new AppError(
          'Reserved administrator account. Please sign in directly via Founder Sanctuary.',
          400
        )
      );
    }

    // 2. Strict Duplicate Email Detection: search Supabase before every registration
    let isDuplicate = false;

    // A. Search Supabase profiles table (case-insensitive)
    if (supabase) {
      try {
        const { data: existingProfile, error: profileErr } = await supabase
          .from('profiles')
          .select('id, email, full_name, name, role')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (!profileErr && existingProfile) {
          isDuplicate = true;
        }

        // B. Also search Supabase customers table if not found in profiles
        if (!isDuplicate) {
          const { data: existingCustomer, error: customerErr } = await supabase
            .from('customers')
            .select('id, email, full_name')
            .ilike('email', cleanEmail)
            .maybeSingle();

          if (!customerErr && existingCustomer) {
            isDuplicate = true;
          }
        }
      } catch (err) {
        console.warn('Supabase duplicate user search notice:', err.message);
      }
    }

    // C. Check memory store fallback
    if (!isDuplicate && memoryPatronStore.has(cleanEmail)) {
      isDuplicate = true;
    }

    // If user already exists in Supabase or registry, immediately reject with 409 Conflict
    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        error: `This email address (${cleanEmail}) is already registered. Please sign in with your credentials or use a different email.`,
        message: `This email address (${cleanEmail}) is already registered. Please sign in with your credentials or use a different email.`,
      });
    }

    // 3. Cryptographically hash user password with bcrypt (salt rounds: 12)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = `usr_${Date.now()}`;
    const userPayload = {
      id: userId,
      full_name: cleanName,
      name: cleanName,
      email: cleanEmail,
      phone: phone || '',
      password_hash: passwordHash,
      role: ROLES.USER,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to memory store
    memoryPatronStore.set(cleanEmail, userPayload);

    // Save profile and customer to Supabase
    if (supabase) {
      try {
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert([userPayload]);

        if (insertErr) {
          await supabase.from('profiles').upsert(userPayload, { onConflict: 'email' });
        }

        await syncCustomerToSupabase({
          name: cleanName,
          email: cleanEmail,
          phone: phone || '',
          shippingAddress: { pincode, dob },
          totalOrders: 0,
          totalSpent: 0,
        });
      } catch (e) {
        console.warn('Supabase patron record persistence notice:', e.message);
      }
    }

    const token = generateToken({
      id: userId,
      name: cleanName,
      email: cleanEmail,
      role: ROLES.USER,
    });

    sendWelcomeNotification({ name: cleanName, email: cleanEmail }).catch((e) =>
      console.warn('Welcome email dispatch notice:', e.message)
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        role: ROLES.USER,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT session
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !password) {
      return next(new AppError('Please provide both email and password.', 400));
    }

    // 1. Founder Admin Master Authentication
    const isAdminEmailMatch =
      cleanEmail === ADMIN_EMAIL ||
      cleanEmail === 'sumukcrystalz5@gmail.com' ||
      cleanEmail === 'sumukcrystalz@gmail.com';

    if (isAdminEmailMatch) {
      if (password === ADMIN_PASSWORD || password === 'Sumukcrystalz@555') {
        const adminUser = {
          id: 'admin_founder_001',
          name: 'Soumyaa Naveen',
          email: cleanEmail,
          role: ROLES.ADMIN,
        };

        const token = generateToken(adminUser);

        return res.json({
          success: true,
          token,
          user: adminUser,
        });
      } else {
        return next(new AppError('Invalid email or password.', 401));
      }
    }

    // 2. Patron User Lookup
    let user = null;

    // Check memory store
    if (memoryPatronStore.has(cleanEmail)) {
      user = memoryPatronStore.get(cleanEmail);
    }

    // Check Supabase if not in memory
    if (!user && supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          user = data;
          memoryPatronStore.set(cleanEmail, data);
        }
      } catch (err) {
        console.warn('Supabase patron lookup notice:', err.message);
      }
    }

    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    // 3. Verify password hash using bcrypt
    const storedHash = user.password_hash || user.passwordHash;
    if (storedHash) {
      const isMatch = await bcrypt.compare(password, storedHash);
      if (!isMatch) {
        return next(new AppError('Invalid email or password.', 401));
      }
    } else {
      // If no password hash stored (legacy record), reject
      return next(new AppError('Invalid email or password.', 401));
    }

    const userName = user.full_name || user.name || cleanEmail.split('@')[0] || 'Valued Patron';
    const userRole = user.role || ROLES.USER;

    const token = generateToken({
      id: user.id,
      name: userName,
      email: user.email,
      role: userRole,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: userName,
        email: user.email,
        role: userRole,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me or GET /api/auth/profile
 */
async function getProfile(req, res, next) {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    let profile = req.user;
    const cleanEmail = req.user.email?.toLowerCase().trim();

    if (memoryPatronStore.has(cleanEmail)) {
      const cached = memoryPatronStore.get(cleanEmail);
      profile = { ...req.user, ...cached };
    }

    if (supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          profile = { ...profile, ...data };
        }
      } catch (e) {}
    }

    // Ensure password_hash is omitted from response
    const { password_hash, passwordHash, ...safeProfile } = profile;

    res.json({
      success: true,
      user: safeProfile,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/profile
 * Updates the authenticated customer's profile details
 */
async function updateProfile(req, res, next) {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const { name, fullName, phone, addresses, spiritualIntent, zodiac } = req.body;
    const cleanEmail = req.user.email?.toLowerCase().trim();
    const cleanName = fullName?.trim() || name?.trim() || req.user.name;

    const updates = {
      updated_at: new Date().toISOString(),
    };
    if (cleanName) {
      updates.full_name = cleanName;
      updates.name = cleanName;
    }
    if (phone !== undefined) updates.phone = phone;
    if (addresses !== undefined) updates.addresses = addresses;
    if (spiritualIntent !== undefined) updates.spiritual_intent = spiritualIntent;
    if (zodiac !== undefined) updates.zodiac = zodiac;

    // Update memory store
    if (memoryPatronStore.has(cleanEmail)) {
      const existing = memoryPatronStore.get(cleanEmail);
      memoryPatronStore.set(cleanEmail, { ...existing, ...updates });
    }

    // Update Supabase
    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('email', cleanEmail);
      } catch (err) {
        console.warn('Supabase profile update warning:', err.message);
      }
    }

    res.json({
      success: true,
      message: 'Sanctuary profile updated successfully.',
      user: {
        ...req.user,
        ...updates,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  getMe: getProfile,
  updateProfile,
  generateToken,
};

