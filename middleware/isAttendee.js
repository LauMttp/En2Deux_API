const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model");
const Attendee = require("../models/Attendee.model");

const isAttendee = async (req, res, next) => {
  const { eventId } = req.params;
  const { attendeeId } = req.params;
  const { optionId } = req.params;
  if (eventId) {
    try {
      const findAttendance = await Attendee.find({
        event: eventId,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        next();
      }
    } catch (error) {
      next(error);
    }
  } else if (attendeeId) {
    try {
      const tierceAttendance = await Attendee.findById(attendeeId);
      const findAttendance = await Attendee.find({
        event: tierceAttendance.event,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        next();
      }
    } catch (error) {
      next(error);
    }
  } else if (optionId) {
    try {
      const option = await Option.findById(optionId);
      const findAttendance = await Attendee.find({
        event: option.event,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        next();
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = isAttendee;
