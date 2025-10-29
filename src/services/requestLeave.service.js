const prisma = require("../config/prisma");

const getAllLeaveRequests = async () => {
  return await prisma.leaveRequest.findMany();
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

module.exports = { getAllLeaveRequests, updateLeaveRequestById };