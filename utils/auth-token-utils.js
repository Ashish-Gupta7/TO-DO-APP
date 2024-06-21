const jwt = require("jsonwebtoken");
const dbgr = require("debug")("development:generateToken");

const generateToken = (user) => {
  try {
    jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY);
  } catch (err) {
    dbgr(`Error during generateToken: ${err}`);
  }
};

module.exports.generateToken = generateToken;