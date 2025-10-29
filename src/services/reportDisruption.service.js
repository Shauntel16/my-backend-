const prisma = require("../config/prisma");

const createDisruption = async (reason, str_date) => {
  return await prisma.libraryClosure.create({
    data: {
      created_by: 1,
      loc_id: 2,
      closure_date: new Date(str_date),
      reason: reason,
    },
  });
};

const getAllDisruptions = async () => {
  return await prisma.libraryClosure.findMany();
};

module.exports = { createDisruption, getAllDisruptions };