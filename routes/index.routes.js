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

// display user friends
router/this.get()

//display one event by ID (with attendees, options, votes, etc)
router.get()

//display one event by name 
router.get()

//display one option (with option ID and current votes)
router.get()

//display all events linked to one user - Kash
router.get();

//display all events - User role = admin
router.get()

//display all events - User role = attendee (notAdmin)
router.get()

// display all upcoming events linked to a user
router.get()

//delete event
router.delete()

//delete options from event
router.delete()

//remove attendee from an event (isAdmin = true)
router.delete()

// remove user from friend list
router.delete()

//Update event informations
router.patch()

//Update options informations (isAdmin = true)
router.patch()

//Update user profile informations
router.patch()

//modify vote
router.patch()

//log out
router.post()



router.use("/auth", authRoutes);

module.exports = router;
