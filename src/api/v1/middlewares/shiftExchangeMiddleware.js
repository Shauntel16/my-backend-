// src/api/v1/middlewares/shiftExchangeMiddleware.js

/**
 * Middleware to validate creating a shift exchange request
 */
function validateShiftExchangeRequest(req, res, next) {
  const { shiftFK_id, requester_id, accepter_id } = req.body;

  // Required fields check
  if (!shiftFK_id || !requester_id || !accepter_id) {
    return res.status(400).json({
      success: false,
      message: 'shiftFK_id, requester_id, and accepter_id are required.',
    });
  }

  // Validate numeric IDs
  if ([shiftFK_id, requester_id, accepter_id].some(id => isNaN(Number(id)))) {
    return res.status(400).json({
      success: false,
      message: 'shiftFK_id, requester_id, and accepter_id must be valid numeric IDs.',
    });
  }

  next();
}

/**
 * Middleware to validate responding to a shift exchange request
 */
function validateShiftExchangeResponse(req, res, next) {
  const { status, admin_id } = req.body;

  // Required fields check
  if (!status || !admin_id) {
    return res.status(400).json({
      success: false,
      message: 'status and admin_id are required.',
    });
  }

  // Validate numeric admin ID
  if (isNaN(Number(admin_id))) {
    return res.status(400).json({
      success: false,
      message: 'admin_id must be a valid numeric ID.',
    });
  }

  // Validate allowed enum values
  const validStatuses = ['ACCEPTED', 'REJECTED'];
  if (!validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}.`,
    });
  }

  // Normalize status to uppercase for consistency
  req.body.status = status.toUpperCase();

  next();
}

module.exports = {
  validateShiftExchangeRequest,
  validateShiftExchangeResponse,
};
