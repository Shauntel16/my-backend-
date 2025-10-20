// src/api/v1/services/shiftService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ShiftService {
  static async createShift(data) {
    const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = data;

    const newShift = await prisma.shift.create({
      data: {
        sched_id,
        studAssi_id,
        shift_date: new Date(shift_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        shift_Status: shift_Status || 'ACTIVE',
      },
    });

    return newShift;
  }

  static async getAllShifts() {
    const shifts = await prisma.shift.findMany({
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });
    return shifts;
  }

  static async updateShift(id, updatedData) {
    const shift_id = parseInt(id);

    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { shift_id },
    });

    if (!existingShift) {
      return null;
    }

    const dataToUpdate = {};

    if (updatedData.sched_id) dataToUpdate.sched_id = updatedData.sched_id;
    if (updatedData.studAssi_id) dataToUpdate.studAssi_id = updatedData.studAssi_id;
    if (updatedData.shift_date) dataToUpdate.shift_date = new Date(updatedData.shift_date);
    if (updatedData.start_time) dataToUpdate.start_time = new Date(updatedData.start_time);
    if (updatedData.end_time) dataToUpdate.end_time = new Date(updatedData.end_time);
    if (updatedData.shift_Status) dataToUpdate.shift_Status = updatedData.shift_Status;

    const updatedShift = await prisma.shift.update({
      where: { shift_id },
      data: dataToUpdate,
    });

    return updatedShift;
  }

  static async deleteShift(id) {
    const shift_id = parseInt(id);

    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { shift_id },
    });

    if (!existingShift) {
      return false;
    }

    await prisma.shift.delete({
      where: { shift_id },
    });

    return true;
  }
}

module.exports = ShiftService;
