// src/api/v1/routes/shiftRoutes.js
const express = require('express');
const router = express.Router();
const ShiftController = require('../../controllers/shiftController');
const { validateShift } = require('../../middlewares/shiftMiddleware');

// Create shift
router.post('/', validateShift, ShiftController.createShift);

// Get all shifts
router.get('/', ShiftController.getAllShifts);

// Update shift
router.put('/:id', ShiftController.updateShift);

// Delete shift
router.delete('/:id', ShiftController.deleteShift);

module.exports = router;
