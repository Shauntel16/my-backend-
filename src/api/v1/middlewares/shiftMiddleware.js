// src/api/v1/middlewares/shiftMiddleware.js


function validateShift(req, res, next) {
  const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = req.body;

  if (!sched_id || !studAssi_id || !shift_date || !start_time || !end_time || !shift_Status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: sched_id, studAssi_id, shift_date, start_time, end_time, and shift_Status are required",
    });
  }

  next();
}

module.exports = validateShift;


