const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const createStudentAssitant = async (name, email, password, cellphone, createdBy, location_id) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.studentAssistant.create({
    data: {
      createdBy: createdBy || 1,
      location_id: location_id || 1,
      name: name,
      email: email,
      password: hashedPassword,
      phone: cellphone,
    },
  });
};

const getAllStudentAssistants = async () => {
  return await prisma.studentAssistant.findMany({
    select: {
      stud_Assistance_id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      created_Date: true,
      updated_Date: true,
      location_id: true,
      createdBy: true,
      // Exclude password field
    },
    orderBy: {
      created_Date: 'desc', // Most recent first
    },
  });
};
const getStudentAssistantByEmail = async (email) => {
  return await prisma.studentAssistant.findUnique({
    where: { email: email },
  });
};

const removeStudentAssistantByEmail = async (email, hardDelete = false) => {
  const studentAssistant = await getStudentAssistantByEmail(email);
  
  if (!studentAssistant) {
    throw new Error('Student assistant not found');
  }

  // Check for pending leave requests if soft delete
  if (!hardDelete) {
    const pendingLeaveRequests = await prisma.leaveRequest.findMany({
      where: {
        studAssi_id: studentAssistant.stud_Assistance_id,
        isGranted: 'PENDING'
      }
    });

    if (pendingLeaveRequests.length > 0) {
      // Soft delete: Update status to DEACTIVATED
      return await prisma.studentAssistant.update({
        where: { email: email },
        data: { status: 'DEACTIVATED' },
      });
    }
  }

  // Hard delete: Completely remove from database
  if (hardDelete) {
    return await prisma.studentAssistant.delete({
      where: { email: email },
    });
  }

  // Soft delete when no pending requests
  return await prisma.studentAssistant.update({
    where: { email: email },
    data: { status: 'DEACTIVATED' },
  });
};

const hardDeleteStudentAssistantByEmail = async (email) => {
  const studentAssistant = await getStudentAssistantByEmail(email);
  
  if (!studentAssistant) {
    throw new Error('Student assistant not found');
  }

  // Check for any related records that would prevent deletion
  const [leaveRequests, attendances, shifts, requestedExchanges, acceptedExchanges] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: { studAssi_id: studentAssistant.stud_Assistance_id },
      take: 1 // We only need to check if any exist
    }),
    prisma.attendance.findMany({
      where: { studAssi_id: studentAssistant.stud_Assistance_id },
      take: 1
    }),
    prisma.shift.findMany({
      where: { studAssi_id: studentAssistant.stud_Assistance_id },
      take: 1
    }),
    prisma.shiftExchange.findMany({
      where: { requester_id: studentAssistant.stud_Assistance_id },
      take: 1
    }),
    prisma.shiftExchange.findMany({
      where: { accepter_id: studentAssistant.stud_Assistance_id },
      take: 1
    }),
  ]);

  const hasRelatedRecords = 
    leaveRequests.length > 0 ||
    attendances.length > 0 ||
    shifts.length > 0 ||
    requestedExchanges.length > 0 ||
    acceptedExchanges.length > 0;

  if (hasRelatedRecords) {
    const error = new Error('Student has references to other tables (leave requests, attendance, shifts, or shift exchanges). You may deactivate instead.');
    error.code = 'HAS_RELATED_RECORDS';
    error.canDeactivate = true;
    throw error;
  }

  // Safe to delete if no related records exist
  return await prisma.studentAssistant.delete({
    where: { email: email },
  });
};

module.exports = {
  createStudentAssitant,
  getAllStudentAssistants,
  getStudentAssistantByEmail,
  removeStudentAssistantByEmail,
  hardDeleteStudentAssistantByEmail,
};