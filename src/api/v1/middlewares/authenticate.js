const authService = require('../../../services/authServices');

function authenticate(req, res, next) {
	try {
		const header = req.headers.authorization || '';
		const token = header.replace(/^Bearer\s+/i, '') || null;
		if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
		const decoded = authService.verifyToken(token);
		// attach user info
		req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
		next();
	} catch (err) {
		next(err);
	}
}

module.exports = authenticate;
