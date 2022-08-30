const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes"));


router.use(isAuthenticated)
router.use("/user", require("./user.routes"));
router.use("/event", require("./event.routes"));
router.use("/attendee", require("./attendee.routes"));
router.use("/option", require("./option.routes"));
router.use("/vote", require("./vote.routes"));
router.use("/friend", require("./friend.routes"));


module.exports = router;
