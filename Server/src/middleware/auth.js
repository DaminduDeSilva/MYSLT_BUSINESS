import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'myslt-business-secret-key-2026';

/**
 * Middleware to verify JWT token (Supports standard JWT and Azure AD)
 */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // 1. Try Local JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (localError) {
      // 2. Try Azure AD Token Decoding
      const decoded = jwt.decode(token);
      if (decoded && (decoded.iss?.includes('sts.windows.net') || decoded.iss?.includes('microsoftonline.com'))) {
        // Map Azure claims to our user object
        req.user = {
          userId: decoded.oid || decoded.sub,
          username: decoded.preferred_username || decoded.upn || decoded.name,
          role: 'admin' // Default Azure users to admin
        };
        return next();
      }

      if (localError.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      }
      throw localError;
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Admin privileges required.' });
  }
  next();
};
