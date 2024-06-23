const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const dbgr = require("debug")("development:auth");

const { generateToken } = require("../utils/auth-token-utils");

const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) return res.status(400).send("User Already Exists");

    bcrypt.genSalt(12, (err, salt) => {
      if (err) return res.status(500).send("Internal Server Error");

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.status(500).send("Internal Server Error");

        try {
          let newUser = await userModel.create({
            name,
            email,
            password: hash,
          });
          let token = generateToken(newUser);
          res.cookie("token", token);
          res.status(201).send("registered");
        } catch (err) {
          dbgr(`Error during user creation: ${err}`);
          return res.status(500).send("Internal Server Error");
        }
      });
    });
  } catch (err) {
    dbgr(`Error during registration: ${err}`);
    return res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email }).select("+password");

    if (!user) return res.status(401).send("Email or Password is incorrect");

    try {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("Internal Server Error");
        if (result) {
          let token = generateToken(user);
          res.cookie("token", token);
          res.status(200).send("user logged in");
        } else {
          return res.status(401).send("Email or Password is incorrect");
        }
      });
    } catch (err) {
      dbgr(`Error during bcrypt-compare: ${err}`);
      return res.status(500).send("Internal Server Error");
    }
  } catch (err) {
    dbgr(`Error during login: ${err}`);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.register = register;
module.exports.login = login;
