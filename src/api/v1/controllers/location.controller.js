const locationService = require("../../../services/location.service");

exports.addLocation = async (req, res, next) => {
  const { name } = req.body;
  const location = await locationService(name);
  console.log(location);
  res.send("Location added");
};
