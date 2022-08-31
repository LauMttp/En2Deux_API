const router = require("express").Router();
const Event = require("../models/Event.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin")

//generate options - Lau
router.post("/:eventId", async (req, res, next) => {
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
router.get("/:eventId/:optionId", async (req, res, next) => {
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
  "/:optionId",
  /*isAdmin*/ async (req, res, next) => {
    try {
      const { optionId } = req.params;
      // const { date, duration, price, location } = req.body;
      const { optionDatas } = { ...req.body };
      for (let key in optionDatas) {
        if (optionDatas[key] === "") {
          delete optionDatas[key];
        }
      }
      const updateOption = await Option.findByIdAndUpdate(
        optionId,
        optionDatas,
        { new: true }
      );
      return res.status(200).json(updateOption);
    } catch (error) {
      next(error);
    }
  }
);

//delete options from event - Kash
router.delete(
  "/optionId",
  /* isAdmin, */ async (req, res, next) => {
    try {
      const { optionId } = req.params;
      const deleteOption = Option.findByIdAndDelete(optionId);
      return res.status(201).json(deleteOption);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
