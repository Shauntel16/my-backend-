function validateShiftExchangeRequest(req, res, next) {
  const { shiftFK_id, requester_id, accepter_id } = req.body;

  if (!shiftFK_id || !requester_id || !accepter_id) {
    return res.status(400).json({
      success: false,
      message: 'shiftFK_id, requester_id, and accepter_id are required',
    });
  }

  next();
}

function validateShiftExchangeResponse(req, res, next) {
  const { status, admin_id } = req.body;

  if (!status || !admin_id) {
    return res.status(400).json({
      success: false,
      message: 'status and admin_id are required',
    });
  }

  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Must be either 'ACCEPTED' or 'REJECTED'",
    });
  }

  next();
}

module.exports = {
  validateShiftExchangeRequest,
  validateShiftExchangeResponse,
};
