const router = require("express").Router();
const User = require("../models/User.model");
const Attendee = require("../models/Attendee.model");
const Friendship = require("../models/Friendship.model");

//Update user profile informations
router.patch("/", async (req, res, next) => {
  const updatedInfos = { ...req.body };
  try {
    const user = await User.findByIdAndUpdate(req.user._id, updatedInfos, {
      new: true,
    });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/", async (req, res, next) => {
  try {
    const userAttendees = await Attendee.find({ user: req.user.id });
    for (let attendee of userAttendees) {
      await Vote.findOneAndDelete({ attendee: attendee._id });
      await Attendee.findByIdAndDelete(attendee._id);
    }
    const userFriendships = await Friendship.find({
      $or: [{ requested: req.user.id }, { requestor: req.user.id }],
    });
    for (let friendship of userFriendships) {
      await Friendship.findOneAndDelete(friendship._id);
    }
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    return res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
