// src/api/v1/controllers/shiftController.js

/**
 * TEMPORARY: In-memory storage for now
 * Later you'll replace this with DB queries.
 */
let shifts = [];
let nextShiftId = 1;

/**
 * @desc Create a new shift
 * @route POST /api/shifts
 */
exports.createShift = (req, res) => {
  try {
    const { schedule_id, sa_id, shift_date, start_time, end_time, status } = req.body;

    // Validate required fields
    if (!schedule_id || !sa_id || !shift_date || !start_time || !end_time || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newShift = {
      shift_id: nextShiftId++,
      schedule_id,
      sa_id,
      shift_date,
      start_time,
      end_time,
      status
    };

    shifts.push(newShift);

    res.status(201).json({
      message: "Shift created successfully",
      shift: newShift
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating shift", error: error.message });
  }
};

/**
 * @desc Get all shifts
 * @route GET /api/shifts
 */
exports.getAllShifts = (req, res) => {
  try {
    res.status(200).json({
      message: "Shifts retrieved successfully",
      shifts
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts", error: error.message });
  }
};

/**
 * @desc Get a single shift by ID
 * @route GET /api/shifts/:id
 */
exports.getShiftById = (req, res) => {
  try {
    const shiftId = parseInt(req.params.id);
    const shift = shifts.find((s) => s.shift_id === shiftId);

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json({ shift });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shift", error: error.message });
  }
};

/**
 * @desc Update a shift
 * @route PUT /api/shifts/:id
 */
exports.updateShift = (req, res) => {
  try {
    const shiftId = parseInt(req.params.id);
    const shift = shifts.find((s) => s.shift_id === shiftId);

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const { schedule_id, sa_id, shift_date, start_time, end_time, status } = req.body;

    // Update only provided fields
    if (schedule_id) shift.schedule_id = schedule_id;
    if (sa_id) shift.sa_id = sa_id;
    if (shift_date) shift.shift_date = shift_date;
    if (start_time) shift.start_time = start_time;
    if (end_time) shift.end_time = end_time;
    if (status) shift.status = status;

    res.status(200).json({
      message: "Shift updated successfully",
      shift
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating shift", error: error.message });
  }
};

/**
 * @desc Delete a shift
 * @route DELETE /api/shifts/:id
 */
exports.deleteShift = (req, res) => {
  try {
    const shiftId = parseInt(req.params.id);
    const index = shifts.findIndex((s) => s.shift_id === shiftId);

    if (index === -1) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const deletedShift = shifts.splice(index, 1);

    res.status(200).json({
      message: "Shift deleted successfully",
      deletedShiftId: deletedShift[0].shift_id
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shift", error: error.message });
  }
};
