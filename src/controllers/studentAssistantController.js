import prisma from "../prisma/client.js";

export const createStudentAssistant = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await prisma.studentAssistant.create({
      data: { name, email },
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentAssistants = async (req, res) => {
  try {
    const students = await prisma.studentAssistant.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
