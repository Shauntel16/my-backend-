const {
  createStudentAssitant,
  getAllStudentAssistants,
  getStudentAssistantByEmail,
  removeStudentAssistantByEmail,
} = require("../../../services/studentAssistant.service");

exports.addStudentAssistant = async (req, res, next) => {
  const { name, email, password, cellphone } = req.body;

  // Validate email format
  if (email.length < 23 || !/^\d{9}@tut4life\.ac\.za$/.test(email)) {
    return res
      .status(400)
      .send(
        "Invalid email format. Email must start with 9 digits representing the student number,followed by @tut4life.ac.za"
      );
  }

  // Validate cellphone
  if (!/^\d{10}$/.test(cellphone)) {
    return res
      .status(400)
      .send("Invalid cellphone number. Cellphone must be exactly 10 digits.");
  }

  // Validate password: must be between 8 and 12 characters
  if (password.length < 8 || password.length > 12) {
    return res
      .status(400)
      .send("Invalid password. Password must be between 8 and 12 characters.");
  }

  const studentAssistant = await createStudentAssitant(
    name,
    email,
    password,
    cellphone
  );
  console.log(studentAssistant);
  res.send("The student assistant was added successfully to the database!");
};

exports.displayAllStudentAssistants = async (req, res, next) => {
  const studentAssistants = await getAllStudentAssistants();
  res.json(studentAssistants);
};

exports.displayStudentAssistantByEmail = async (req, res, next) => {
  const { email } = req.body;
  const studentAssistant = await getStudentAssistantByEmail(email);
  res.json(studentAssistant);
};

exports.removeStudentAssistantByEmail = async (req, res, next) => {
  const { email } = req.body;
  const studentAssistant = await removeStudentAssistantByEmail(email);
  console.log(studentAssistant);
  res.send(`The student assistant with email: ${email}, has been removed!`);
};
