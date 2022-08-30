const router = require("express").Router();

const User = require("../models/User.model");


//Update user profile informations
router.patch("/updateProfile", async (req, res, next) => {
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
        const userIsAttendees = await Attendee.find({user : req.user.id});
        for (let attendee of userIsAttendees){
          await Vote.findOneAndDelete({attendee : attendee.id});
          await Attendee.findOneAndDelete(attendee);
        }
        const userHasFriendships = await Friendship.find({
          $or: [{ requested: req.user.id }, { requestor: req.user.id }]
        });
        for (let friendship of userHasFriendships){
          await Friendship.findOneAndDelete(friendship);
        }
        const deletedUser = await User.findByIdAndDelete(req.user.id);
        return res.status(200).json(deletedUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
