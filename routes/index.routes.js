const router = require("express").Router();
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Friendship = require("../models/Friendship.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAuthenticated = require("../middleware/isAuthenticated");

router.use("/auth", require("./auth.routes"));
router.use("/user", require("./user.routes"));
router.use("/event", require("./event.routes"));
router.use("/attendee", require("./attendee.routes"));
router.use("/option", require("./option.routes"));
router.use("/vote", require("./vote.routes"));
router.use("/friend", require("./friend.routes"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
