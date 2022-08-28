const router = require("express").Router();
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Friendship = require("../models/Friendship.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAuthenticated = require("../middleware/isAuthenticated");

router.use("/auth", require("./auth.routes.js"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// Create an event  - Lau
router.post("/createevent/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const {
      name,
      description,
      // startingDate,
      // durationInHours,
      // location,
      // budget,
      votingStageDeadline,
    } = req.body;
    const { userId } = req.params;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid event name." });
    } else {
      const eventCreated = await Event.create({
        name,
        author: userId,
        description,
        // startingDate,
        // durationInHours,
        // location,
        // budget,
        votingStageDeadline,
      });
      return res.status(201).json(eventCreated);
    }
  } catch (error) {
    next(error);
  }
});

//Invite people --> create attendee document - Kash
router.post(
  "/attendee/:eventId/:userId/:attendeeId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { eventId, userId, attendeeId } = req.params;
      const myEvent = await Event.findById(eventId);
      if (myEvent.author !== userId) {
        return res
          .status(401)
          .json({ message: "Only event admin(s) can invite new people." });
      }
      const createdAttendee = await Attendee.create({
        event: eventId,
        user: attendeeId,
      });
      return res.status(201).json(createdAttendee);
    } catch (error) {
      next(error);
    }
  }
);

//generate options - Lau
router.post(
  "/addoption/:userId/:eventId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, eventId } = req.params;
      const { date, duration, price, location } = req.body;
      const myEvent = await Event.findById(eventId);
      if (myEvent.author !== userId) {
        return res
          .status(401)
          .json({ message: "Only event admin(s) can create new option." });
      } else if (!date || !duration || !price || !location) {
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
  }
);

//vote creation - Kash
router.post("/vote/:attendeeId", isAuthenticated, async (req, res, next) => {
  try {
    const { attendeeId } = req.params;
    const { firstChoice, secondChoice, thirdChoice } = req.body;
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

//send friendship request - Lau
router.post(
  "addFriend/:requestorId/:requestedId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { requestorId, requestedId } = req.params;
      const newFriendshipRequest = await Friend.create({
        requestor: requestorId,
        requested: requestedId,
        status: "pending",
      });
      return res.status(201).json(newFriendshipRequest);
    } catch (error) {
      next(error);
    }
  }
);

//accept friendship request - Lau ---> is it a get request ??
router.post(
  "friendshipRequest/:userId/:friendshipId/:answer",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, friendshipId, answer } = req.params;
      const friendshipRequest = await Friendship.findById(friendshipId);
      if (friendshipRequest.requested !== userId) {
        return res.status(401).json({
          message: "Invalid user, you can't answer this friendship request.",
        });
      } else if (
        friendshipRequest.status === "accepted" ||
        friendshipRequest.status === "declined"
      ) {
        return res
          .status(401)
          .json({ message: "You already answered this friendship request." });
      } else if (answer === "yes") {
        friendshipRequest.status = "accepted";
        return res.status(201).json(friendshipRequest);
      } else if (answer === "no") {
        friendshipRequest.status = "declined";
        return res.status(201).json(friendshipRequest);
      }
    } catch (error) {
      next(error);
    }
  }
);

// display user friends
router / this.get();

//display one event by ID (with attendees, options, votes, etc)
router.get();

//display one event by name
router.get();

//display one option (with option ID and current votes)
router.get();

//display all events linked to one user - Kash
router.get("/event/:idUser", async (req, res, next) => {
  try {
    const idUser = req.params;
  } catch (error) {
    next(error);
  }
});

//display all events - User role = admin
router.get();

//display all events - User role = attendee (notAdmin)
router.get();

// display all upcoming events linked to a user
router.get();

//delete event
router.delete();

//delete options from event
router.delete();

//remove attendee from an event (isAdmin = true)
router.delete();

// remove user from friend list
router.delete();

//Update event informations
router.patch();

//Update options informations (isAdmin = true)
router.patch();

//Update user profile informations
router.patch();

//modify vote
router.patch();

//log out
router.post();

module.exports = router;
