import prisma from "../prisma/client.js";

export const createSchedule = async (req, res) => {
  try {
    const { month, year, studentAssistantId } = req.body;
    const schedule = await prisma.schedule.create({
      data: { month, year, studentAssistantId },
    });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: { studentAssistant: true },
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
