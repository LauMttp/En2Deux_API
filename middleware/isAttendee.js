const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");

const isAttendee = async (req, res, next) => {
  const { eventId } = req.params;
  const { attendeeId } = req.params;
  const { optionId } = req.params;
  const { voteId } = req.params;
  if (eventId) {
    try {
      const findAttendance = await Attendee.findOne({
        event: eventId,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        return next();
      }
    } catch (error) {
      return next(error);
    }
  } else if (attendeeId) {
    try {
      const tierceAttendance = await Attendee.findById(attendeeId);

      const findAttendance = await Attendee.findOne({
        event: tierceAttendance.event,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        return next();
      }
    } catch (error) {
      return next(error);
    }
  } else if (optionId) {
    try {
      const option = await Option.findById(optionId);
      const findAttendance = await Attendee.findOne({
        event: option.event,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res
          .status(401)
          .json({ message: "You are not attending this event" });
      } else {
        req.attendee = findAttendance;
        return next();
      }
    } catch (error) {
      return next(error);
    }
  } else if (voteId) {
    try {
      const vote = await Vote.findById(voteId);
      const findAttendance = await Attendee.findOne({
        _id: vote.attendee,
        user: req.user._id,
      });
      if (!findAttendance) {
        return res.status(401).json({ message: "Bad user request" });
      } else {
        req.attendee = findAttendance;
        return next();
      }
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = isAttendee;
