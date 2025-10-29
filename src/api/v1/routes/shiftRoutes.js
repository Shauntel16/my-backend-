const express = require('express');
const router = express.Router();

const ShiftController = require('../controllers/shiftController');
const validateShift = require('../middlewares/shiftMiddleware');
const authenticate = require('../middlewares/authenticate'); 

router.post('/', 
  express.json(), 
  authenticate('admin'),  
  validateShift, 
  ShiftController.createShift
);


router.get('/', 
  authenticate('admin', 'assistant'),
  ShiftController.getAllShifts
);


router.get('/:id', 
  authenticate('admin', 'assistant'), 
  ShiftController.getShiftById
);


router.put('/:id', 
  express.json(), 
  authenticate('admin'),  // 
  ShiftController.updateShift
);


router.delete('/:id', 
  authenticate('admin'),  // 
  ShiftController.deleteShift
);

module.exports = router;
