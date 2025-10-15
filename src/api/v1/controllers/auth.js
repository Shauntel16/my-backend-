const authService = require('../../../services/authServices');

async function login(req, res, next) {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
		const data = await authService.login({ email, password });
		if (!data) return res.status(401).json({ success: false, message: 'Invalid credentials' });
		res.json({ success: true, token: data.token, user: data.user });
	} catch (err) {
		next(err);
	}
}

function logout(req, res) {
	// token expected in Authorization header
	const header = req.headers.authorization || '';
	const token = header.replace(/^Bearer\s+/i, '') || null;
	if (!token) return res.status(400).json({ success: false, message: 'No token provided' });
	const ok = authService.logout(token);
	if (!ok) return res.status(400).json({ success: false, message: 'Unable to revoke token' });
	res.json({ success: true, message: 'Logged out' });
}

function verify(req, res) {
	// verify endpoint: token validated by middleware and decoded attached to req.user
	res.json({ success: true, user: req.user });
}

module.exports = { login, logout, verify };
