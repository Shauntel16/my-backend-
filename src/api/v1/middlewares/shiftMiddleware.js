// src/api/v1/middlewares/shiftMiddleware.js

function validateShift(req, res, next) {
  const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = req.body;

  // Required fields
  if (!sched_id || !studAssi_id || !shift_date || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: sched_id, studAssi_id, shift_date, start_time, and end_time are required.',
    });
  }

  // Validate IDs are numeric
  if (isNaN(Number(sched_id)) || isNaN(Number(studAssi_id))) {
    return res.status(400).json({
      success: false,
      message: 'sched_id and studAssi_id must be valid numeric IDs.',
    });
  }

  // Validate dates
  const shiftDateValid = !isNaN(new Date(shift_date).getTime());
  const startTimeValid = !isNaN(new Date(start_time).getTime());
  const endTimeValid = !isNaN(new Date(end_time).getTime());

  if (!shiftDateValid || !startTimeValid || !endTimeValid) {
    return res.status(400).json({
      success: false,
      message: 'shift_date, start_time, and end_time must be valid date/time values.',
    });
  }

  // Validate shift_Status enum
  const validStatuses = ['ACTIVE', 'DEACTIVATED']; // matches Prisma schema enum Shift_Status
  if (shift_Status && !validStatuses.includes(shift_Status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid shift_Status value. Allowed values: ${validStatuses.join(', ')}.`,
    });
  }

  next();
}

module.exports = validateShift;
      