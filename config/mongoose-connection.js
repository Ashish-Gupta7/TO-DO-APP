const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/TO-DO-APP")
  .then((result) => {
    dbgr(
      `Connected with Database host: ${result.connection.host}, Database name: ${result.connection.name}`
    );
  })
  .catch((err) => {
    dbgr(err.message);
  });

module.exports = mongoose.connection;
