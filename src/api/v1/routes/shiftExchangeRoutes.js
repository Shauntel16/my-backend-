const express = require('express');
const router = express.Router();
const shiftExchangeController = require('../controllers/shiftExchangeController');
const {
  validateShiftExchangeRequest,
  validateShiftExchangeResponse,
} = require('../middlewares/shiftExchangeMiddleware');

// Request shift exchange
router.post('/', express.json(), validateShiftExchangeRequest, shiftExchangeController.requestExchange);

// List all shift exchanges
router.get('/', shiftExchangeController.listAllExchanges);

// Accept/Decline shift exchange
router.put('/:id', express.json(), validateShiftExchangeResponse, shiftExchangeController.respondToExchange);

module.exports = router;
