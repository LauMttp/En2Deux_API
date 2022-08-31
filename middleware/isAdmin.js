const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model");
const Attendee = require("../models/Attendee.model");

const isAdmin = async (req, res, next) => {
  if (!req.attendee.isAdmin) {
    return res.status(401).json({
      message: "Missing Authorization. You are not administrating this event",
    });
  }
  next();
};

module.exports = isAdmin;
