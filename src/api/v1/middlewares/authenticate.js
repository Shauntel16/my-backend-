const authService = require('../../../services/authServices');
function authenticate(...allowedRoles) {
  return (req, res, next) => {
    try {
     
      const header = req.headers.authorization || '';
      const token = header.replace(/^Bearer\s+/i, '') || null;
      if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }

      const decoded = authService.verifyToken(token);

     
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };

      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: insufficient permissions',
        });
      }

      next();
    } catch (err) {
      res.status(err.status || 403).json({
        success: false,
        message: err.message || 'Authentication failed',
      });
    }
  };
}

module.exports = authenticate;
