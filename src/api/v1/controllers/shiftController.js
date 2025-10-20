const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @desc Create a new shift
 * @route POST /api/shifts
 */
exports.createShift = async (req, res) => {
  try {
    const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = req.body;

    // Validate required fields (basic example)
    if (!sched_id || !studAssi_id || !shift_date || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newShift = await prisma.shift.create({
      data: {
        sched_id,
        studAssi_id,
        shift_date: new Date(shift_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        shift_Status: shift_Status || "ACTIVE",
      },
    });

    res.status(201).json({
      message: "Shift created successfully",
      shift: newShift,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating shift", error: error.message });
  }
};

/**
 * @desc Get all shifts
 * @route GET /api/shifts
 */
exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany({
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });

    res.status(200).json({
      message: "Shifts retrieved successfully",
      shifts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching shifts", error: error.message });
  }
};

/**
 * @desc Get a single shift by ID
 * @route GET /api/shifts/:id
 */
exports.getShiftById = async (req, res) => {
  try {
    const shift_id = parseInt(req.params.id);

    const shift = await prisma.shift.findUnique({
      where: { shift_id },
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });

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
exports.updateShift = async (req, res) => {
  try {
    const shift_id = parseInt(req.params.id);
    const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = req.body;

    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { shift_id },
    });

    if (!existingShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const updatedShift = await prisma.shift.update({
      where: { shift_id },
      data: {
        ...(sched_id && { sched_id }),
        ...(studAssi_id && { studAssi_id }),
        ...(shift_date && { shift_date: new Date(shift_date) }),
        ...(start_time && { start_time: new Date(start_time) }),
        ...(end_time && { end_time: new Date(end_time) }),
        ...(shift_Status && { shift_Status }),
      },
    });

    res.status(200).json({
      message: "Shift updated successfully",
      shift: updatedShift,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating shift", error: error.message });
  }
};

/**
 * @desc Delete a shift
 * @route DELETE /api/shifts/:id
 */
exports.deleteShift = async (req, res) => {
  try {
    const shift_id = parseInt(req.params.id);

    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { shift_id },
    });

    if (!existingShift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    await prisma.shift.delete({
      where: { shift_id },
    });

    res.status(200).json({
      message: "Shift deleted successfully",
      deletedShiftId: shift_id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shift", error: error.message });
  }
};
