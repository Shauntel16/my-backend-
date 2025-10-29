const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const createStudentAssitant = async (name, email, password, cellphone) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return await prisma.studentAssistant.create({
    data: {
      createdBy: 2,
      location_id: 1,
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
  return await prisma.studentAssistant.delete({
    where: { email: email },
  });
};

module.exports = {
  createStudentAssitant,
  getAllStudentAssistants,
  getStudentAssistantByEmail,
  removeStudentAssistantByEmail,
};