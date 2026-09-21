import jwt from 'jsonwebtoken';

/**
 * Validates JWT token from the Authorization header for Next.js Route Handlers.
 * Enforces Role-Based Access Control (RBAC) ensuring role === 'admin'.
 */
export function verifyAdminAuth(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return {
        isAuthorized: false,
        status: 401,
        error: 'Missing authentication token. Authorization header required.',
      };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('FATAL: JWT_SECRET is not configured on server.');
      return {
        isAuthorized: false,
        status: 500,
        error: 'Server security configuration error.',
      };
    }

    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return {
        isAuthorized: false,
        status: 401,
        error: 'Invalid or expired token: ' + err.message,
      };
    }

    if (!decoded || decoded.role !== 'admin') {
      return {
        isAuthorized: false,
        status: 403,
        error: 'Access Forbidden: Administrator role (role === "admin") required.',
      };
    }

    return {
      isAuthorized: true,
      user: decoded,
    };
  } catch (err) {
    return {
      isAuthorized: false,
      status: 500,
      error: 'Authentication verification failure: ' + err.message,
    };
  }
}

/**
 * Validates user authentication (any valid user or admin)
 */
export function verifyUserAuth(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!token) {
      return {
        isAuthorized: false,
        status: 401,
        error: 'Missing authentication token.',
      };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return {
        isAuthorized: false,
        status: 500,
        error: 'Security configuration error.',
      };
    }

    const decoded = jwt.verify(token, secret);
    return {
      isAuthorized: true,
      user: decoded,
    };
  } catch (err) {
    return {
      isAuthorized: false,
      status: 401,
      error: 'Invalid or expired token: ' + err.message,
    };
  }
}
