const prisma = require("../config/prisma");

const loc = async (name) => {
  return await prisma.location.create({
    data: {
      name: name,
    },
  });
};

module.exports = loc;