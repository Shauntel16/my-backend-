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
  return await prisma.studentAssistant.findMany();
};
const getStudentAssistantByEmail = async (email) => {
  return await prisma.studentAssistant.findUnique({
    where: { email: email },
  });
};

const removeStudentAssistantByEmail = async (email) => {
  // Soft delete: Update status to DEACTIVATED instead of hard delete
  // This preserves data integrity (leave requests, attendance, etc.)
  return await prisma.studentAssistant.update({
    where: { email: email },
    data: { status: 'DEACTIVATED' },
  });
};

module.exports = {
  createStudentAssitant,
  getAllStudentAssistants,
  getStudentAssistantByEmail,
  removeStudentAssistantByEmail,
};