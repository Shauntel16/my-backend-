const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const authenticate = require('../middlewares/authenticate');

router.post('/login', express.json(), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/verify', authenticate, authController.verify);

module.exports = router;
