const router = require("express").Router();
const Attendee = require("../models/Attendee.model");
const Event = require("../models/Event.model");
const Vote = require("../models/Vote.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin");

//get all attendee of an event
router.get("/:eventId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const attendeesOfEvent = await Attendee.find({ event: eventId });
    return res.status(200).json(attendeesOfEvent);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:eventId/:userToAddId",
  isAttendee,
  isAdmin,
  async (req, res, next) => {
    try {
      const { eventId, userToAddId } = req.params;

      const attendeeReqExist = await Attendee.findOne({
        event: eventId,
        user: userToAddId,
      });
      if (attendeeReqExist) {
        return res
          .status(400)
          .json({ message: "Attendee already exists or request is pending." });
      }
      // need to indicate in the req.body isAdmin: true if you want to set the attendee as admin
      const { isAdmin } = req.body;
      const createdAttendee = await Attendee.create({
        event: eventId,
        user: userToAddId,
        isAdmin,
        status: "pending",
      });
      return res.status(201).json(createdAttendee);
    } catch (error) {
      next(error);
    }
  }
);

//Answer attendee document
router.patch("/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { answer } = req.body;
    const { attendeeId } = req.params;
    const attendeeRequest = await Attendee.findById(attendeeId);
    if (attendeeRequest.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Invalid user, you can't answer this attendee request.",
      });
    } else if (
      attendeeRequest.status === "accepted" ||
      attendeeRequest.status === "declined"
    ) {
      return res
        .status(401)
        .json({ message: "You already answered this attendee request." });
    }
    if (answer === "yes") {
      const attendeeReqAccepted = await Attendee.findByIdAndUpdate(
        attendeeId,
        { status: "accepted" },
        { new: true }
      );
      return res.status(201).json(attendeeReqAccepted);
    } else if (answer === "no") {
      const attendeeReqDeclined = await Attendee.findByIdAndUpdate(
        attendeeId,
        { status: "declined" },
        { new: true }
      );
      res.status(201).json(attendeeReqDeclined);
      const voteToBeDeleted = await Vote.findOne({
        attendee: req.attendee._id,
      });
      const deletedVote = await Vote.findByIdAndDelete(voteToBeDeleted._id);
      const deletedAttendance = await Attendee.findByIdAndDelete(
        req.attendee._id
      );
      return res.status(201).json({ deletedAttendance, deletedVote });
    }
  } catch (error) {
    next(error);
  }
});

//information providing route
router.patch(
  "/informationproviding/:attendeeId",
  isAttendee,
  async (req, res, next) => {
    try {
      const { attendeeId } = req.params;
      // TODO : need to check "location" is a value from the locationSuggestions of the event and availabilities is an array of valid upcoming dates
      const { availabilities, budget, location, hasAnswered } = req.body;
      const eventAttendance = await Attendee.findById(attendeeId);
      const myEvent = await Event.findById(eventAttendance.event);
      const informationToProvide = {
        availabilities,
        budget,
        location,
        hasAnswered,
      };
      if (eventAttendance.user.toString() !== req.user.id) {
        return res.status(401).json({
          message: "Invalid user, you can't provide information for this user.",
        });
      } else if (
        myEvent.stage === "Voting stage" ||
        myEvent.stage === "On-going" ||
        myEvent.stage === "Upcoming" ||
        myEvent.stage === "Finished"
      ) {
        return res.status(401).json({
          message: "Information gathering stage finished.",
        });
      } else {
        const providingInfos = await Attendee.findByIdAndUpdate(
          attendeeId,
          informationToProvide,
          { new: true }
        );
        return res.status(201).json(providingInfos);
      }
    } catch (error) {
      next(error);
    }
  }
);

//remove attendee from an event
router.delete("/:attendeeId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    await Vote.findOneAndDelete({ attendee: attendeeId });
    const removeAttendee = await Attendee.findByIdAndDelete(attendeeId);
    return res.status(201).json(removeAttendee);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
