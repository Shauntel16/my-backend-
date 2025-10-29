import prisma from "../prisma/client.js";

export const markAttendance = async (req, res) => {
  try {
    const { date, status, studentAssistantId, scheduleId } = req.body;
    const attendance = await prisma.attendance.create({
      data: { date: new Date(date), status, studentAssistantId, scheduleId },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: { studentAssistant: true, schedule: true },
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
