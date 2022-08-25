const router = require("express").Router();
const authRoutes = require("./auth.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Create user / signup - Lau
router.post();

//Log in - Kash
router.post();

// Create an event  - Lau
router.post();

//Invite people --> create attendee document - Kash
router.post();

//generate options - Lau
router.post();

//vote creation - Kash
router.post();

//add friends - Lau
router.post();

//display event linked to one user - Kash
router.get();

router.use("/auth", authRoutes);

module.exports = router;
