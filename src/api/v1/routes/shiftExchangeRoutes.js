const express = require('express');
const router = express.Router();
const shiftExchangeController = require('../controllers/shiftExchangeController');
const {
  validateShiftExchangeRequest,
  validateShiftExchangeResponse,
} = require('../middlewares/shiftExchangeMiddleware');

// Request shift exchange
router.post('/', validateShiftExchangeRequest, shiftExchangeController.requestExchange);

// List all shift exchanges
router.get('/', shiftExchangeController.listAllExchanges);

// Accept/Decline shift exchange
router.put('/:id', validateShiftExchangeResponse, shiftExchangeController.respondToExchange);

module.exports = router;
