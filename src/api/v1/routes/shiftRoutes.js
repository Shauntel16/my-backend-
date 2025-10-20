const express = require('express');

const router = express.Router();
const ShiftController = require('../controllers/shiftController'); // ✅ FIXED PATH
const validateShift = require('../middlewares/shiftMiddleware'); // default export


// Create shift 
router.post('/', express.json(), validateShift, ShiftController.createShift);

// Get all shifts
router.get('/', ShiftController.getAllShifts);

// Get single shift by ID
router.get('/:id', ShiftController.getShiftById);

// Update shift - consider adding validation here if partial updates are allowed
router.put('/:id', express.json(), ShiftController.updateShift);

// Delete shift
router.delete('/:id', ShiftController.deleteShift);

module.exports = router;
