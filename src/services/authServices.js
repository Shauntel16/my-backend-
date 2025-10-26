const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { jwtSecret, jwtExpiresIn } = require('../config');

const prisma = new PrismaClient();

 
const tokenBlacklist = new Set();


async function findUserByEmail(email) {
	const domain = email.split('@')[1]?.toLowerCase();

	if (domain === 'tut.ac.za') {
		const admin = await prisma.administrator.findUnique({ where: { email } });
		if (!admin) return null;
		return {
			id: admin.admin_id,
			email: admin.email,
			passwordHash: admin.password,
			role: 'admin'
		};
	} else if (domain === 'tut4life.ac.za') {
		const assistant = await prisma.studentAssistant.findUnique({ where: { email } });
		if (!assistant) return null;
		return {
			id: assistant.stud_Assistance_id,
			email: assistant.email,
			passwordHash: assistant.password,
			role: 'assistant'
		};
	}

	// Domain not recognized
	return null;
}

/**
 * Authenticate user and issue JWT
 */
async function login({ email, password }) {
	const user = await findUserByEmail(email);
	if (!user) return null;

	const match = await bcrypt.compare(password, user.passwordHash);
	if (!match) return null;

	const payload = { sub: user.id, email: user.email, role: user.role };
	const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

	return { 
		token, 
		user: { id: user.id, email: user.email, role: user.role } 
	};
}

/**
 * Revoke a token (logout)
 */
function logout(token) {
	if (!token) return false;
	tokenBlacklist.add(token);
	return true;
}

/**
 * Check if token is blacklisted
 */
function isBlacklisted(token) {
	return tokenBlacklist.has(token);
}

/**
 * Verify JWT and ensure it’s not blacklisted
 */
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
	tokenBlacklist
};
