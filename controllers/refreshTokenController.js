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

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  let foundUser;
  try {
    foundUser = await User.findOne({ refreshToken }).exec();
  } catch (error) {
    console.error(error?.reason);
  }

  if (!foundUser) return res.sendStatus(403); //Forbidden

  // evaluate jwt
  try {
    const newAccessToken = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403);
          // create access JWT
          const roles = Object.values(foundUser.roles);
          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: decoded.username,
                roles: roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
          );
          resolve({ accessToken });
        }
      );
    });
    res.json(newAccessToken);
  } catch (err) {
    console.error(err);
    return res.sendStatus(403); //Forbidden
  }
};

module.exports = { handleRefreshToken };
