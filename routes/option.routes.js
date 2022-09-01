const router = require("express").Router();
const Option = require("../models/Option.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin");

//generate options 
router.post("/:eventId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { date, duration, price, location } = req.body;
    if (!date || !duration || !price || !location) {
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

//display one option with option ID 
router.get("/:optionId", isAttendee, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const myOption = await Option.findById(optionId);
    if (!myOption) {
      return res.status(404).json({ message: "No option found.." });
    } else {
      return res.status(201).json(myOption);
    }
  } catch (error) {
    next(error);
  }
});

//Update options informations 
// ++++ update only before vote stage
router.patch("/:optionId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    // const { date, duration, price, location } = req.body;
    const { optionDatas } = { ...req.body };
    for (let key in optionDatas) {
      if (optionDatas[key] === "") {
        delete optionDatas[key];
      }
    }
    const updateOption = await Option.findByIdAndUpdate(optionId, optionDatas, {
      new: true,
    });
    return res.status(200).json(updateOption);
  } catch (error) {
    next(error);
  }
});

//delete options from event 
router.delete("/optionId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const deleteOption = Option.findByIdAndDelete(optionId);
    return res.status(201).json(deleteOption);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
