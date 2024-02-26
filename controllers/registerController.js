const User = require("../model/User");
const bcrypt = require("bcrypt");

// setting up local file simultaneously with mongodb collection
const dbEvents = require("../middleware/dbHandler");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
    dbEvents(data, "users.json");
  },
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  let duplicate;
  try {
    duplicate = await User.findOne({ username: user }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (duplicate) return res.sendStatus(409); //Conflict

  if (user.length < 6 || user.length > 20)
    return res.status(400).json({
      message: "Username must betweeen 6 and 20 in length.",
    });

  const usrRegex = /^[A-Za-z]\w*/;
  if (!usrRegex.test(user))
    return res.status(400).json({
      message:
        "Username must start with a letter and can contain only letters, digits and underscore.",
    });

  const underscoreCount = (user.match(/_/g) || []).length;
  const digitCount = (user.match(/\d/g) || []).length;
  if (underscoreCount > 2 || digitCount > 2)
    return res.status(400).json({
      message: "Username cant contain more than 2 digits or underscore.",
    });

  const pwdRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*(\W|_)).{8,16}/;

  if (!pwdRegex.test(pwd))
    return res.status(400).json({
      message:
        "Password must contain at least one uppercase, one lowercase and one special chartacter, and its length need to be more than 8 and less than 16.",
    });

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result);

    const newUser = {
      id: usersDB.users?.length
        ? usersDB.users[usersDB.users.length - 1].id + 1
        : 1,
      username: user,
      // assigning default user role during registration
      roles: { User: 2001 },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
