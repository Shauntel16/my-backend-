const express = require('express');

const router = express.Router();
const ShiftController = require('../controllers/shiftController'); 
const validateShift = require('../middlewares/shiftMiddleware'); 


// Create shift 
router.post('/', express.json(), validateShift, ShiftController.createShift);

// Get all shifts
router.get('/', ShiftController.getAllShifts);

// Get single shift by ID
router.get('/:id', ShiftController.getShiftById);


router.put('/:id', express.json(), ShiftController.updateShift);

// Delete shift
router.delete('/:id', ShiftController.deleteShift);

module.exports = router;
