const disruptions = [];

exports.createdDisruption = (req, res, next) => {
  const { disrupDate, reason } = req.body;

  disruptions.push({ disrupDate: disrupDate, reason: reason });
  res.send("The disruption has been recorded and sent to students");
};

exports.getDiruptions = (req, res, next) => {
  res.send(disruptions);
};
