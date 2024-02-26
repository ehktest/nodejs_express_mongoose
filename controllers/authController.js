const User = require("../model/User");
// setting up local file simultaneously with mongodb collection
const dbEvents = require("../middleware/dbHandler");

const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
    dbEvents(data, "users.json");
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // on the other hand updating local file simultaneously
    // Saving refreshToken with current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );

    const currentUser = { ...foundUser._doc, refreshToken };
    currentUser.id = currentUser._id;
    ["_id", "__v"].forEach((key) => delete currentUser[key]);
    usersDB.setUsers([...otherUsers, currentUser]);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
