const studAssistances = [
  {
    id: "1",
    name: "MADIMETJA",
    email: "231933271@tut4life.ac.za",
    password: "10111",
    phone: "0818461529",
  },
  {
    id: "2",
    name: "TRYPHO",
    email: "madi@gmail.com",
    password: "54321",
    phone: "07939293",
  },
  {
    id: "3",
    name: "KGOBE",
    email: "try@gmail.com",
    password: "123456",
    phone: "07607103",
  },
];

//Used for just testing only
exports.getStudAssistance = (req, res, next) => {
  res.send("Arrived");
};

//funtion to add students
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

//Function to remove student Assistance
exports.removeStudAssistance = (req, res, next) => {
  const { email } = req.body;

  const index = studAssistances.findIndex((element) => element.email === email);

  const removedStudent = studAssistances.splice(index, 1);
  console.log(removedStudent);
  console.log(index);
  res.send("Removed Student assistance: ", removedStudent);
};

//Function to display all student assistance
exports.displayStud = (req, res, next) => {
  res.send(studAssistances);
};
