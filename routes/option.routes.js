const router = require("express").Router();
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Friendship = require("../models/Friendship.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAuthenticated = require("../middleware/isAuthenticated");

//generate options - Lau
router.post("/:eventId", isAuthenticated, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { date, duration, price, location } = req.body;
    const isAttendee = await Attendee.find({
      event: eventId,
      user: req.user._id,
    });
    const myEvent = await Event.findById(eventId);
    if (myEvent.author !== req.user._id || isAttendee.isAdmin === false) {
      return res
        .status(401)
        .json({ message: "Only event admin(s) can create new option." });
    } else if (!date || !duration || !price || !location) {
      return res.status(401).json({
        message:
          "Please, provide date, duration, price and location to create a new option.",
      });
    } else {
      const newOption = await Option.create({
        event: eventId,
        date,
        duration,
        price,
        location,
      });
      return res.status(201).json(newOption);
    }
  } catch (error) {
    next(error);
  }
});

//display one option with option ID - Lau
router.get("/:eventId/:optionId", isAuthenticated, async (req, res, next) => {
  try {
    const { eventId, optionId } = req.params;
    const isAttendee = await Attendee.find({
      event: eventId,
      user: req.user._id,
    });
    if (!isAttendee) {
      return res.status(401).json({
        message: "Access denied. You can't access this event information.",
      });
    } else {
      const myOption = await Option.find({ _id: optionId, event: eventId });
      if (!myOption) {
        return res.status(404).json({ message: "No option found.." });
      } else {
        return res.status(201).json(myOption);
      }
    }
  } catch (error) {
    next(error);
  }
});

//Update options informations (isAdmin = true) - Kash
// ++++ update only before vote stage
router.patch(
  "/:id",
  isAuthenticated,
  /*isAdmin*/ async (req, res, next) => {
    try {
      const { id } = req.params;
      const { date, duration, price, location } = req.body;
      const updateOption = await Option.findByIdAndUpdate(
        id,
        { date, duration, price, location },
        { new: true }
      );
      return res.json(updateOption);
    } catch (error) {
      next(error);
    }
  }
);

//delete options from event - Kash
router.delete(
  "/:id",
  isAuthenticated,
  /* isAdmin, */ async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteOption = Option.findByIdAndDelete({ _id: id });
      return res.status(202).json(deleteOption);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
