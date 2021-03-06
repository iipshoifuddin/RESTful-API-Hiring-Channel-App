const express = require("express");
const Route = express.Router();

// import routes
const engineers = require("./routes/engineers");
const companies = require("./routes/companies");
const auth = require("./routes/auth");
const message = require("./routes/message");
const tes = require("./routes/tes");

Route.use("/engineers", engineers)
  .use("/companies", companies)
  .use("/auth", auth)
  .use("/message", message)
  .use("/tes", tes);

module.exports = Route;
