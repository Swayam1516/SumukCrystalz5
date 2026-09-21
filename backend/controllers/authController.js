const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');
const { sendWelcomeNotification } = require('../services/emailService');
const { supabase, syncCustomerToSupabase } = require('../utils/supabase');

/**
 * Signs a JWT with user payload
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server security configuration error: JWT_SECRET missing.', 500);
  }

  const role = user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
  const userId = user.id || user._id || 'usr_unknown';

  return jwt.sign(
    {
      sub: userId,
      id: userId,
      name: user.name,
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
 */
async function register(req, res, next) {
  try {
    const { email, password, fullName, phone, pincode, dob } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0] || 'Valued Patron';

    if (cleanEmail === ADMIN_EMAIL || cleanEmail === 'sumukcrystalz5@gmail.com' || cleanEmail === 'sumukcrystalz@gmail.com') {
      return next(new AppError('Reserved administrator account. Please sign in directly via Founder Sanctuary.', 400));
    }

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
    };

    // Save to Supabase
    if (supabase) {
      await supabase.from('profiles').upsert(userPayload, { onConflict: 'email' });
      syncCustomerToSupabase({
        name: cleanName,
        email: cleanEmail,
        phone: phone || '',
        shippingAddress: { pincode, dob },
        totalOrders: 0,
        totalSpent: 0,
      }).catch((e) => console.warn('Supabase customer sync notice:', e.message));
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
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !password) {
      return next(new AppError('Please provide both email and password.', 400));
    }

    // Founder Admin Master Authentication
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
        return next(new AppError('Invalid administrator credentials.', 401));
      }
    }

    // Query Supabase for patron user
    let user = null;
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('email', cleanEmail).single();
      if (data) {
        user = data;
      }
    }

    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (user.password_hash) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return next(new AppError('Invalid email or password.', 401));
      }
    }

    const token = generateToken({
      id: user.id,
      name: user.full_name || user.name || 'Valued Patron',
      email: user.email,
      role: user.role || ROLES.USER,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name || user.name,
        email: user.email,
        role: user.role || ROLES.USER,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
async function getProfile(req, res, next) {
  try {
    res.json({
      success: true,
      user: req.user,
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
  generateToken,
};
