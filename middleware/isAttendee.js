const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");

const isAttendee = async (req, res, next) => {
  const { eventId, attendeeId, optionId, voteId } = req.params;
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
      if (!tierceAttendance) {
        return res
          .status(401)
          .json({ message: "This attendee document does not exist." });
      }

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

      if (!option) {
        return res.status(401).json({message: "This option document does not exist."});
      } 
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
