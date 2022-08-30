const router = require("express").Router();
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Friendship = require("../models/Friendship.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAuthenticated = require("../middleware/isAuthenticated");

//Update user profile informations
router.patch("/updateProfile", isAuthenticated, async (req, res, next) => {
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
router.delete("/", isAuthenticated, async (req,res,next) => {
    try {
        
    } catch (error) {
        next(error);
    }
})

module.exports = router;
