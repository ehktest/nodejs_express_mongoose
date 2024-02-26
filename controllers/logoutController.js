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

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  let foundUser;
  try {
    foundUser = await User.findOne({ refreshToken }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      // sameSite: "None",
      // secure: true
    });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  const loggedOutUser = await foundUser.save();

  // on the other hand updating local file simultaneously
  // Delete refreshToken in db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== refreshToken
  );
  const currentUser = { ...foundUser._doc };
  currentUser.id = currentUser._id;
  ["_id", "__v"].forEach((key) => delete currentUser[key]);
  usersDB.setUsers([...otherUsers, currentUser]);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
