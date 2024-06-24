const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth-controller");
const { isLoggedIn } = require("../middleware/login-middleware");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/register", register);

router.post("/login", login);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.status(200).send("logout");
});

module.exports = router;
