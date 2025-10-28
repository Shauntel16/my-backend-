const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ShiftService {
  static validStatuses = ['ACTIVE', 'DEACTIVATED'];

  // Create a new shift
  static async createShift(data) {
    const { sched_id, studAssi_id, shift_date, start_time, end_time, shift_Status } = data;

    // Validate foreign keys
    const [scheduleExists, assistantExists] = await Promise.all([
      prisma.schedule.findUnique({ where: { schedule_id: sched_id } }),
      prisma.studentAssistant.findUnique({ where: { stud_Assistance_id: studAssi_id } }),
    ]);

    if (!scheduleExists) throw new Error('Schedule not found');
    if (!assistantExists) throw new Error('Student Assistant not found');

    // Validate shift status
    const status = shift_Status || 'ACTIVE';
    if (!this.validStatuses.includes(status)) throw new Error(`Invalid shift_Status value. Allowed values: ${this.validStatuses.join(', ')}`);

    // Validate dates
    const shiftDateObj = new Date(shift_date);
    const startTimeObj = new Date(start_time);
    const endTimeObj = new Date(end_time);
    if (isNaN(shiftDateObj) || isNaN(startTimeObj) || isNaN(endTimeObj)) {
      throw new Error('Invalid date format for shift_date, start_time, or end_time');
    }

    const newShift = await prisma.shift.create({
      data: {
        sched_id,
        studAssi_id,
        shift_date: shiftDateObj,
        start_time: startTimeObj,
        end_time: endTimeObj,
        shift_Status: status,
      },
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });

    return newShift;
  }

  // Retrieve all shifts with related info
  static async getAllShifts() {
    return await prisma.shift.findMany({
      include: {
        studentAssistant: true,
        schedule: true,
      },
      orderBy: { shift_date: 'asc' },
    });
  }

  // Get a single shift by ID
  static async getShiftById(id) {
    const shift_id = parseInt(id);
    return await prisma.shift.findUnique({
      where: { shift_id },
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });
  }

  // Update shift data
  static async updateShift(id, updatedData) {
    const shift_id = parseInt(id);

    const existingShift = await prisma.shift.findUnique({ where: { shift_id } });
    if (!existingShift) return null;

    const dataToUpdate = {};

    if (updatedData.sched_id) {
      const scheduleExists = await prisma.schedule.findUnique({ where: { schedule_id: updatedData.sched_id } });
      if (!scheduleExists) throw new Error('Schedule not found');
      dataToUpdate.sched_id = updatedData.sched_id;
    }

    if (updatedData.studAssi_id) {
      const assistantExists = await prisma.studentAssistant.findUnique({ where: { stud_Assistance_id: updatedData.studAssi_id } });
      if (!assistantExists) throw new Error('Student Assistant not found');
      dataToUpdate.studAssi_id = updatedData.studAssi_id;
    }

    if (updatedData.shift_date) {
      const dateObj = new Date(updatedData.shift_date);
      if (isNaN(dateObj)) throw new Error('Invalid shift_date format');
      dataToUpdate.shift_date = dateObj;
    }

    if (updatedData.start_time) {
      const dateObj = new Date(updatedData.start_time);
      if (isNaN(dateObj)) throw new Error('Invalid start_time format');
      dataToUpdate.start_time = dateObj;
    }

    if (updatedData.end_time) {
      const dateObj = new Date(updatedData.end_time);
      if (isNaN(dateObj)) throw new Error('Invalid end_time format');
      dataToUpdate.end_time = dateObj;
    }

    if (updatedData.shift_Status) {
      if (!this.validStatuses.includes(updatedData.shift_Status)) {
        throw new Error(`Invalid shift_Status value. Allowed values: ${this.validStatuses.join(', ')}`);
      }
      dataToUpdate.shift_Status = updatedData.shift_Status;
    }

    return await prisma.shift.update({
      where: { shift_id },
      data: dataToUpdate,
      include: {
        studentAssistant: true,
        schedule: true,
      },
    });
  }

  // Delete a shift
  static async deleteShift(id) {
    const shift_id = parseInt(id);

    const existingShift = await prisma.shift.findUnique({ where: { shift_id } });
    if (!existingShift) return false;

    await prisma.shift.delete({ where: { shift_id } });
    return true;
  }
}

module.exports = ShiftService;
