const ShiftExchangeService = require('../../../services/shiftExchangeService');

/**
 * @desc Request a new shift exchange
 * @route POST /api/shift-exchanges
 */
exports.requestExchange = async (req, res) => {
  try {
    const { shiftFK_id, requester_id, accepter_id } = req.body;

    // Validate input
    if (!shiftFK_id || !requester_id || !accepter_id) {
      return res.status(400).json({
        success: false,
        message: 'shiftFK_id, requester_id, and accepter_id are required.',
      });
    }

    const newExchange = await ShiftExchangeService.requestExchange({
      shiftFK_id,
      requester_id,
      accepter_id,
    });

    res.status(201).json({
      success: true,
      message: 'Shift exchange request created successfully.',
      data: newExchange,
    });
  } catch (error) {
    console.error('Error creating shift exchange:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shift exchange request.',
      error: error.message,
    });
  }
};

/**
 * @desc Get all shift exchange requests
 * @route GET /api/shift-exchanges
 */
exports.listAllExchanges = async (req, res) => {
  try {
    const exchanges = await ShiftExchangeService.listAll();

    res.status(200).json({
      success: true,
      message: 'Shift exchange requests retrieved successfully.',
      count: exchanges.length,
      data: exchanges,
    });
  } catch (error) {
    console.error('Error fetching shift exchanges:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shift exchange requests.',
      error: error.message,
    });
  }
};

/**
 * @desc Respond to a shift exchange (approve or reject)
 * @route PUT /api/shift-exchanges/:id
 */
exports.respondToExchange = async (req, res) => {
  try {
    const exchange_id = parseInt(req.params.id);
    const { status, admin_id } = req.body;

    // Validate input
    if (!status || !admin_id) {
      return res.status(400).json({
        success: false,
        message: 'status and admin_id are required.',
      });
    }

    // Validate enum
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const updatedExchange = await ShiftExchangeService.respondToExchange(
      exchange_id,
      status,
      admin_id
    );

    if (!updatedExchange) {
      return res.status(404).json({
        success: false,
        message: 'Shift exchange request not found or already processed.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Shift exchange request ${status.toLowerCase()}.`,
      data: updatedExchange,
    });
  } catch (error) {
    console.error('Error updating shift exchange:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shift exchange request.',
      error: error.message,
    });
  }
};
