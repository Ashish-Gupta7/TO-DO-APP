const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// dotenv, config and db
require("dotenv").config();
require("./config/mongoose-connection");
const dbgr = require("debug")("development:PORT");

// routers
const indexRouter = require("./routers/index");

// set path for views and public folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// req.body data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware for cookies, sessions, flash-msg
app.use(cookieParser());
app.use(
  expressSession({
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
  })
);
app.use(flash());

// middleware for routers
app.use("/", indexRouter);

// server on
const PORT = process.env.PORT;

app.listen(PORT, () => {
  dbgr(`Server listening on port ${PORT}`);
});
