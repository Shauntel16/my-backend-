const {
  createDisruption,
  getAllDisruptions,
} = require("../../../services/reportDisruption.service");

exports.createdDisruption = async (req, res, next) => {
  const { reason, str_date } = req.body;

  const disruption = await createDisruption(reason, str_date);
  console.log(disruption);
  res.send("The disruption has been recorded and sent to student assistants");
};

exports.getDisruptions = async (req, res, next) => {
  const allDisruptions = await getAllDisruptions();
  res.json(allDisruptions);
};
