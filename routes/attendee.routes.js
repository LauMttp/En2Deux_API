const router = require("express").Router();
const Event = require("../models/Event.model");
const Attendee = require("../models/Attendee.model");
const Vote = require("../models/Vote.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin")

//Invite people --> create attendee document - Kash
router.post("/:eventId/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { eventId, attendeeId } = req.params;
    // need to indicate in the req.body isAdmin: true if you want to set the attendee as admin
    const { isAdmin } = req.body;
    const myEvent = await Event.findById(eventId);
    if (myEvent.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Only event admin(s) can invite new people." });
    } else {
      const createdAttendee = await Attendee.create({
        event: eventId,
        user: attendeeId,
        isAdmin,
        status: "pending",
      });
      return res.status(201).json(createdAttendee);
    }
  } catch (error) {
    next(error);
  }
});

//Answer attendee document
router.patch("/:attendeeId", async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const { answer } = req.body;
    const attendanceRequest = await Attendee.findById(attendeeId);
    if (attendanceRequest.user !== req.user._id) {
      return res.status(401).json({
        message: "Invalid user, you can't answer this attendance request.",
      });
    } else if (answer === "yes") {
      attendanceRequest.status = "accepted";
      return res.status(201).json(attendanceRequest);
    } else if (answer === "no") {
      attendanceRequest.status = "declined";
      const voteToBeDeleted = await Vote.findOne({
        attendee: attendanceRequest._id,
      });
      const deletedVote = await Vote.findByIdAndDelete(voteToBeDeleted._id);
      const deletedAttendance = await Attendee.findByIdAndDelete(
        attendanceRequest
      );
      return res.status(201).json({deletedAttendance, deletedVote});
    }
  } catch (error) {
    next(error);
  }
});

//remove attendee from an event
router.delete("/:eventId/:attendeeId", async (req, res, next) => {
  try {
    const { eventId, attendeeId } = req.params;
    const requestorAttendance = await Attendee.find({
      event: eventId,
      user: req.user._id,
    });
    if (!requestorAttendance.isAdmin) {
      return res.status(400).json({
        message: "Access denied. You can't remove an attendee from this event.",
      });
    } else {
      const attendeeToBeRemoved = await Attendee.find({
        event: eventId,
        user: attendeeId,
      });
      const voteToBeDeleted = await Vote.find({
        attendee: attendeeToBeRemoved._id,
      });
      const deleteVote = await Vote.findByIdAndDelete(voteToBeDeleted._id);
      const removeAttendee = await Attendee.findByIdAndDelete(
        attendeeToBeRemoved._id
      );
      return res.status(201).json({deleteVote, removeAttendee});
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
