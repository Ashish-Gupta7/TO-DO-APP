const express = require("express");
const router = express.Router();
const dbgr = require("debug")("development:index");

const { register, login } = require("../controllers/auth-controller");
const { isLoggedIn } = require("../middleware/login-middleware");

router.post("/register", register);

router.post("/login", login);

router.get("/profile/:name/logout", isLoggedIn, (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  res.status(200).send("logout");
});

router.use((err, req, res) => {
  if (err && err.statusCode === 401) {
    // Redirect to login page
    res.redirect("/login");
  } else {
    // Handle other errors as needed
    dbgr(`Error during index router: ${err.statusMessage}`);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
