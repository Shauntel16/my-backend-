const prisma = require("../config/prisma");

const getLeaveRequestProofById = async (leave_id) => {
  const leaveRequest = await prisma.leaveRequest.findUnique({
    where: { leave_id: parseInt(leave_id) },
    select: {
      leave_id: true,
      proof_file_content: true,
      proof_file_type: true,
      proof_file_name: true,
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return leaveRequest;
};

const getAllLeaveRequests = async () => {
  return await prisma.leaveRequest.findMany({
    include: {
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
      administrator: {
        select: {
          admin_id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const createLeaveRequest = async (leaveRequestData) => {
  const {
    studAssi_id,
    reviewed_by,
    reason,
    start_Date,
    end_date,
    leave_type,
    proof_file_content,
    proof_file_type,
    proof_file_name,
  } = leaveRequestData;

  // Validate that student assistant exists
  const studentAssistant = await prisma.studentAssistant.findUnique({
    where: { stud_Assistance_id: studAssi_id },
  });

  if (!studentAssistant) {
    throw new Error("Student Assistant not found");
  }

  // Validate that administrator exists
  const administrator = await prisma.administrator.findUnique({
    where: { admin_id: reviewed_by },
  });

  if (!administrator) {
    throw new Error("Administrator not found");
  }

  // Validate date range
  const startDate = new Date(start_Date);
  const endDate = new Date(end_date);

  if (startDate >= endDate) {
    throw new Error("Start date must be before end date");
  }

  // Create leave request
  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      studAssi_id,
      reviewed_by,
      reason,
      start_Date: startDate,
      end_date: endDate,
      leave_type,
      proof_file_content: proof_file_content || null,
      proof_file_type: proof_file_type || null,
      proof_file_name: proof_file_name || null,
      isGranted: "PENDING",
    },
    include: {
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
      administrator: {
        select: {
          admin_id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return leaveRequest;
};

const getLeaveRequestsByStudentAssistant = async (studAssi_id) => {
  return await prisma.leaveRequest.findMany({
    where: {
      studAssi_id: parseInt(studAssi_id),
    },
    include: {
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
      administrator: {
        select: {
          admin_id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      start_Date: 'desc',
    },
  });
};

const getLeaveRequestById = async (leave_id, studAssi_id = null) => {
  const whereClause = { leave_id: parseInt(leave_id) };
  
  // If studAssi_id is provided, ensure the leave request belongs to that student assistant
  if (studAssi_id) {
    whereClause.studAssi_id = parseInt(studAssi_id);
  }

  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: whereClause,
    include: {
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
      administrator: {
        select: {
          admin_id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return leaveRequest;
};

const updateLeaveRequestById = async (leave_id, isGranted, reviewed_by) => {
  return await prisma.leaveRequest.update({
    where: { leave_id: leave_id },
    data: {
      isGranted: isGranted,
      reviewed_at: new Date(),
      reviewed_by: reviewed_by,
    },
  });
};

const updateLeaveRequestProof = async (leave_id, studAssi_id, proof_file_content, proof_file_type, proof_file_name) => {
  // First verify the leave request belongs to this student assistant
  const leaveRequest = await prisma.leaveRequest.findFirst({
    where: {
      leave_id: parseInt(leave_id),
      studAssi_id: parseInt(studAssi_id),
    },
  });

  if (!leaveRequest) {
    throw new Error("Leave request not found or you don't have permission to update it");
  }

  // Allow updating proof if request is PENDING or APPROVED, but not if DECLINED
  if (leaveRequest.isGranted === "DECLINED") {
    throw new Error("Cannot update proof for a declined leave request");
  }

  // Update the proof
  return await prisma.leaveRequest.update({
    where: { leave_id: parseInt(leave_id) },
    data: {
      proof_file_content: proof_file_content || null,
      proof_file_type: proof_file_type || null,
      proof_file_name: proof_file_name || null,
    },
    include: {
      studentAssistant: {
        select: {
          stud_Assistance_id: true,
          name: true,
          email: true,
        },
      },
      administrator: {
        select: {
          admin_id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

module.exports = {
  getAllLeaveRequests,
  createLeaveRequest,
  getLeaveRequestsByStudentAssistant,
  getLeaveRequestById,
  updateLeaveRequestById,
  getLeaveRequestProofById,
  updateLeaveRequestProof,
};