const ShiftExchangeService = require('../../../services/shiftExchangeService');

exports.requestExchange = async (req, res) => {
  try {
    const { shiftFK_id, requester_id, accepter_id } = req.body;

    if (!shiftFK_id || !requester_id || !accepter_id) {
      return res.status(400).json({ message: 'shiftFK_id, requester_id and accepter_id are required' });
    }

    const newExchange = await ShiftExchangeService.requestExchange({ shiftFK_id, requester_id, accepter_id });

    res.status(201).json({
      message: 'Shift exchange request created successfully',
      data: newExchange,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating shift exchange request', error: error.message });
  }
};

exports.listAllExchanges = async (req, res) => {
  try {
    const exchanges = await ShiftExchangeService.listAll();

    res.status(200).json({
      message: 'Shift exchange requests retrieved successfully',
      data: exchanges,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shift exchange requests', error: error.message });
  }
};

exports.respondToExchange = async (req, res) => {
  try {
    const exchange_id = parseInt(req.params.id);
    const { status, admin_id } = req.body;

    if (!status || !admin_id) {
      return res.status(400).json({ message: 'status and admin_id are required' });
    }

    const updatedExchange = await ShiftExchangeService.respondToExchange(exchange_id, status, admin_id);

    if (!updatedExchange) {
      return res.status(404).json({ message: 'Shift exchange request not found or already processed' });
    }

    res.status(200).json({
      message: `Shift exchange request ${status.toLowerCase()}`,
      data: updatedExchange,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating shift exchange request', error: error.message });
  }
};
