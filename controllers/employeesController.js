const Employee = require("../model/Employee");

// setting up local file simultaneously with mongodb collection
const dbEvents = require("../middleware/dbHandler");

const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
    dbEvents(data, "employees.json");
  },
};

const getAllEmployees = async (req, res) => {
  let allEmployees;
  try {
    allEmployees = await Employee.find({});
  } catch (error) {
    console.error(error?.reason);
  }
  res.json(allEmployees ?? {});
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "firstname and lastname parameters are required." });
  }

  const newEmployee = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  try {
    const createdEmployee = await Employee.create(newEmployee);
    // on the other hand updating local file simultaneously
    newEmployee.id = createdEmployee._doc._id;
    data.setEmployees([...data.employees, newEmployee]);

    res.status(201).json(createdEmployee);
  } catch (error) {
    console.error(error?.reason);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id parameter is required." });
  }

  let employee;
  try {
    employee = await Employee.findOne({ _id: req.body.id }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();

  // on the other hand updating local file simultaneously
  const filteredArray = data.employees.filter((emp) => emp.id !== req.body.id);
  const unsortedArray = [...filteredArray, result._doc];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id parameter is required." });
  }

  let employee;
  try {
    employee = await Employee.findOne({ _id: req.body.id }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  const result = await employee.deleteOne({ _id: req.body.id }); //{ _id: req.body.id }

  // on the other hand updating local file simultaneously
  const filteredArray = data.employees.filter((emp) => emp.id !== req.body.id);
  console.log("filteredArray: ", filteredArray);
  data.setEmployees([...filteredArray]);

  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required." });

  let employee;
  try {
    employee = await Employee.findOne({ _id: req.params.id }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
