const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret, jwtExpiresIn } = require('../config');

// In-memory user store for demo. Replace with DB in production.
const users = [
	{
		id: '1',
		email: 'admin@tut.ac.za',
		passwordHash: bcrypt.hashSync('AdminPass123!', 8),
		role: 'admin'
	},
	{
		id: '2',
		email: 'student@tut4life.ac.za',
		passwordHash: bcrypt.hashSync('StudentPass123!', 8),
		role: 'assistant'
	}
];

// Simple token blacklist for logout (in-memory). For production use a persistent store.
const tokenBlacklist = new Set();

async function findUserByEmail(email) {
	return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

async function login({ email, password }) {
	const user = await findUserByEmail(email);
	if (!user) return null;
	const match = await bcrypt.compare(password, user.passwordHash);
	if (!match) return null;

	const payload = { sub: user.id, email: user.email, role: user.role };
	const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
	return { token, user: { id: user.id, email: user.email, role: user.role } };
}

function logout(token) {
	if (!token) return false;
	tokenBlacklist.add(token);
	return true;
}

function isBlacklisted(token) {
	return tokenBlacklist.has(token);
}

function verifyToken(token) {
	if (!token) throw new Error('No token provided');
	if (isBlacklisted(token)) {
		const err = new Error('Token is revoked');
		err.status = 401;
		throw err;
	}
	try {
		const decoded = jwt.verify(token, jwtSecret);
		return decoded;
	} catch (e) {
		e.status = 401;
		throw e;
	}
}

module.exports = {
	login,
	logout,
	verifyToken,
	// exported for tests or later use
	users,
	tokenBlacklist
};
