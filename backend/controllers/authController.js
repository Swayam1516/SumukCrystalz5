const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');
const { sendWelcomeNotification } = require('../services/emailService');
const { syncCustomerToSupabase } = require('../utils/supabase');

/**
 * Signs a JWT with user payload
 */
function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('Server security configuration error: JWT_SECRET missing.', 500);
  }

  const role = user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
  const userId = user._id ? user._id.toString() : (user.id || 'usr_unknown');

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

    if (cleanEmail === ADMIN_EMAIL) {
      return next(new AppError('Reserved administrator account. Please sign in directly via Founder Sanctuary.', 400));
    }

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return next(new AppError('An account with this email address already exists. Please log in.', 400));
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: ROLES.USER,
      phone: phone || '',
      addresses: pincode ? [{ postalCode: pincode, line1: '' }] : [],
    });

    const token = generateToken(createdUser);

    // Sync to Supabase asynchronously in background
    syncCustomerToSupabase({
      name: cleanName,
      email: cleanEmail,
      phone: phone || '',
      shippingAddress: { pincode, dob },
      totalOrders: 0,
      totalSpent: 0,
    }).catch((e) => console.warn('Supabase customer sync notice:', e.message));

    // Dispatch welcome email asynchronously
    sendWelcomeNotification({ name: cleanName, email: cleanEmail }).catch((e) =>
      console.warn('Welcome email dispatch notice:', e.message)
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: createdUser._id.toString(),
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
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

    // Check for Founder Admin Master Authentication
    if (cleanEmail === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        const adminUser = {
          _id: 'admin_founder_001',
          id: 'admin_founder_001',
          name: 'Soumyaa Naveen',
          email: ADMIN_EMAIL,
          role: ROLES.ADMIN,
        };

        const token = generateToken(adminUser);

        return res.json({
          success: true,
          token,
          user: {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          },
        });
      } else {
        return next(new AppError('Invalid administrator credentials.', 401));
      }
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
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


