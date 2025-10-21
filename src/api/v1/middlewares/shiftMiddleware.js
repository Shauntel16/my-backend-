// src/api/v1/middlewares/shiftMiddleware.js


function validateShift(req, res, next) {
  const { schedule_id, sa_id, shift_date, start_time, end_time, status } = req.body;

  if (!schedule_id || !sa_id || !shift_date || !start_time || !end_time || !status) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: schedule_id, sa_id, shift_date, start_time, end_time, and status are required',
    });
  }

  next();
}

module.exports = validateShift;


