const studAssistances = [];

exports.getStudAssistance = (req, res, next) => {
  res.send("Arrived");
};

exports.addStud = (req, res, next) => {
  const { studId, name, email, password, phone } = req.body;

  studAssistances.push({
    id: studId,
    name: name,
    email: email,
    password: password,
    phone: phone,
  });

  res.send("Student assistance added");
};

exports.removeStudAssistance = (req, res, next) => {
  studAssistances.forEach((element) => {
    const { studId } = req.body;

    if (element.id == studId) {
      //code for removing
    }
  });

  console.log("This student has been removed: ", removedStudent);
  res.send("Removed Student assistance");
};

exports.displayStud = (req, res, next) => {
  console.log(studAssistances);
  res.send("Student assistance displayed in the console");
};
