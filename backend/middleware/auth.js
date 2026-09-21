const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { ROLES } = require('../utils/constants');

/**
 * Validates Bearer JWT, extracts identity, and attaches req.user
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return next(new AppError('Authentication required. Please provide a Bearer token.', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('FATAL: JWT_SECRET is not configured.');
      return next(new AppError('Server security configuration error.', 500));
    }

    const decoded = jwt.verify(token, secret);

    let user = null;
    if (decoded.sub && typeof decoded.sub === 'string' && decoded.sub.length === 24) {
      try {
        user = await User.findById(decoded.sub).select('-passwordHash');
      } catch (err) {
        user = null;
      }
    }

    if (user) {
      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || decoded.role || ROLES.USER,
      };
    } else {
      req.user = {
        id: decoded.sub || 'anon',
        name: decoded.name || 'User',
        email: decoded.email,
        role: decoded.role || ROLES.USER,
      };
    }

    next();
  } catch (err) {
    return next(new AppError('Invalid or expired authentication token: ' + err.message, 401));
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
  requireAdmin,
  // Backward compatibility alias
  requireAuth: authenticate,
};
