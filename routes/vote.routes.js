const router = require("express").Router();
const Vote = require("../models/Vote.model");
const Attendee = require("../models/Attendee.model");
const isAttendee = require("../middleware/isAttendee");

//vote creation
router.post("/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const { firstChoice, secondChoice, thirdChoice } = req.body;
    const voteOfAttendee = await Attendee.findById(attendeeId);
    if (voteOfAttendee.user.toString() !== req.user.id) {
      return res.status(401).json({message: "Invalid user, you can't do that.",});
    } else if (!firstChoice) {
      return res.status(401).json({
        message: "Please, provide at least 1 choice.",
      });
    }
    const createdVote = await Vote.create({
      attendee: attendeeId,
      firstChoice,
      secondChoice,
      thirdChoice,
    });
    res.status(201).json(createdVote);
  } catch (error) {
    next(error);
  }
});

//get all votes
router.get("/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const votesOfAttendee = await Vote.findOne({attendee: attendeeId});
    return res.status(201).json(votesOfAttendee);
  } catch (error) {
    next(error);
  }
});

// TODO: get vote related to one option sorted by first/second/third choice
router.get("/byoption/:optionId", isAttendee, async (req, res, next) => {
  try {
    const { optionId } = req.params;
    const votesOfMyOption = await Vote.find({
      $or: [
        { firstChoice: optionId },
        { secondChoice: optionId },
        { thirdChoice: optionId },
      ],
    });
    console.log(votesOfMyOption);
    return res.status(201).json(votesOfMyOption);
  } catch (error) {
    next(error);
  }
});

//modify vote
router.patch("/:voteId", isAttendee, async (req, res, next) => {
  try {
    const { voteId } = req.params;
    const newVote = { ...req.body };
    for (let key in newVote) {
      if (
        newVote[key] === "" &&
        key !== "secondchoice" &&
        key !== "thirdchoice"
      ) {
        delete updatedInfos[key];
      }
    }
    const updatedVote = await Vote.findByIdAndUpdate(voteId, newVote, {
      new: true,
    });
    return res.status(201).json(updatedVote);
  } catch (error) {
    next(error);
  }
});

//delete vote by attendee
router.delete("/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const deletedVote = await Vote.findOneAndDelete({attendee: attendeeId});
    return res.status(201).json(deletedVote);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
