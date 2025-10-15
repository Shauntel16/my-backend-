// src/api/v1/services/shiftService.js

let shifts = []; // In-memory storage for now
let nextId = 1;

class ShiftService {
  static createShift(data) {
    const newShift = { id: nextId++, ...data };
    shifts.push(newShift);
    return newShift;
  }

  static getAllShifts() {
    return shifts;
  }

  static updateShift(id, updatedData) {
    const shiftIndex = shifts.findIndex((shift) => shift.id === parseInt(id));
    if (shiftIndex === -1) {
      return null;
    }
    shifts[shiftIndex] = { ...shifts[shiftIndex], ...updatedData };
    return shifts[shiftIndex];
  }

  static deleteShift(id) {
    const index = shifts.findIndex((shift) => shift.id === parseInt(id));
    if (index === -1) return false;
    shifts.splice(index, 1);
    return true;
  }
}

module.exports = ShiftService;
