const router = require("express").Router();
const Vote = require("../models/Vote.model");
const isAttendee = require("../middleware/isAttendee");

//vote creation
router.post("/:attendeeId", isAttendee, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const { firstChoice, secondChoice, thirdChoice } = req.body;
    if (!firstChoice) {
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

// get vote related to one option sorted by first/second/third choice
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
    const updatedVote = Vote.findByIdAndUpdate(voteId, newVote, {
      new: true,
    });
    return res.status(201).json(updatedVote);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
