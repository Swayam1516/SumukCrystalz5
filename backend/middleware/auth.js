const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');
const { supabase } = require('../utils/supabase');

/**
 * Validates Bearer JWT or Supabase Auth Token, extracts identity, and attaches req.user
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return next(new AppError('Authentication required. Please provide a Bearer token.', 401));
    }

    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    // 1. Try verifying via standard JWT secret
    try {
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.sub || decoded.id || 'usr_patron',
        name: decoded.name || 'Valued Patron',
        email: decoded.email,
        role: decoded.role || ROLES.USER,
      };
      return next();
    } catch (jwtErr) {
      // 2. If standard JWT fails, verify against Supabase Auth (Source of Truth)
      if (supabase) {
        try {
          const { data: { user: sbUser }, error: sbErr } = await supabase.auth.getUser(token);
          if (!sbErr && sbUser) {
            const userEmail = sbUser.email?.toLowerCase().trim();
            const isAdmin =
              sbUser.user_metadata?.role === 'admin' ||
              userEmail === (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();

            req.user = {
              id: sbUser.id,
              name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || userEmail.split('@')[0],
              email: userEmail,
              role: isAdmin ? ROLES.ADMIN : ROLES.USER,
            };
            return next();
          }
        } catch (sbEx) {}
      }

      return next(new AppError('Invalid or expired authentication token.', 401));
    }
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token: ' + err.message, 401));
  }
}

/**
 * Optional Authentication: Attaches req.user if valid token provided, but allows unauthenticated patrons to proceed
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      req.user = null;
      return next();
    }

    const secret = process.env.JWT_SECRET || 'sumuk_crystalz_luxury_secret_key_99482749102834710293';

    try {
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.sub || decoded.id || 'usr_patron',
        name: decoded.name || 'Valued Patron',
        email: decoded.email,
        role: decoded.role || ROLES.USER,
      };
      return next();
    } catch (jwtErr) {
      if (supabase) {
        try {
          const { data: { user: sbUser }, error: sbErr } = await supabase.auth.getUser(token);
          if (!sbErr && sbUser) {
            const userEmail = sbUser.email?.toLowerCase().trim();
            const isAdmin =
              sbUser.user_metadata?.role === 'admin' ||
              userEmail === (process.env.ADMIN_EMAIL || 'sumukcrystalz5@gmail.com').toLowerCase().trim();

            req.user = {
              id: sbUser.id,
              name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || userEmail.split('@')[0],
              email: userEmail,
              role: isAdmin ? ROLES.ADMIN : ROLES.USER,
            };
            return next();
          }
        } catch (sbEx) {}
      }

      req.user = null;
      return next();
    }
  } catch (err) {
    req.user = null;
    next();
  }
}

/**
 * Enforces Role-Based Access Control (RBAC) ensuring role === 'admin'
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(new AppError('Authentication required.', 401));
  }

  if (req.user.role !== ROLES.ADMIN) {
    return next(
      new AppError('Access Forbidden: Administrator privileges required (role === "admin").', 403)
    );
  }

  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
  requireAuth: authenticate,
};
