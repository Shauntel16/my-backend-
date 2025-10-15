// src/api/v1/middlewares/shiftMiddleware.js

function validateShift(req, res, next) {
  const { employeeName, startTime, endTime, date } = req.body;

  if (!employeeName || !startTime || !endTime || !date) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: employeeName, startTime, endTime, and date are required",
    });
  }

  next();
}

module.exports = { validateShift };
