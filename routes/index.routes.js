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
      const { _id } = eventCreated;
      const creatorAttendance = await Attendee.create({
        event: _id,
        user: userId,
        isAdmin: true,
      });
      return res.status(201).json(eventCreated, creatorAttendance);
    }
  } catch (error) {
    next(error);
  }
});

//Invite people --> create attendee document - Kash
// --> get user / event / attendee ID from params or body ????
router.post(
  "/addAttendee/:eventId/:userId/:attendeeId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { eventId, userId, attendeeId } = req.params;
      const myEvent = await Event.findById({ _id: eventId });
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
      const isAttendee = await Attendee.find({ event: eventId, user: userId });
      const myEvent = await Event.findById({ _id: eventId });
      if (myEvent.author !== userId || isAttendee.isAdmin === false) {
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
// --> get user / event / Option ID from params or body ????
router.post(
  "/vote/:attendeeId/:firstChoice/:secondChoice/:thirdChoice",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { attendeeId, firstChoice, secondChoice, thirdChoice } = req.params;
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
  }
);

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
      const friendshipRequest = await Friendship.findById({
        _id: friendshipId,
      });
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

// display user friends - Lau
router.get("/friends/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const allMyFriends = await Friendship.find({
      requested: userId,
      status: "accepted",
    });
    // add to find request the condition || {requestor: userId, status:"accepted"}
    return res.status(200).json(allMyFriends);
  } catch (error) {
    next(error);
  }
});

//display one event by ID (with attendees, options, votes, etc) - Kash
router.get("/events/:idEvent", isLoggedIn, async (req, res, next) => {
  try {
    const { idEvent } = req.params;
    const findEvent = await Event.findById({ _id: idEvent });
    const findOptions = await Option.find({ event: idEvent });

    //findAttendees is an Array
    const findAttendees = await Attendee.find({ event: idEvent });

    //findVotes is an array of objects
    let findVotes = [];
    //For one attendee of findAttendees,
    //I'll find his 3 votes and store them in votesOf.votes
    //Each attendee will have his own object named votesOf
    //and I'll store every votesOf objects in findVotes
    for (let attendee of findAttendees) {
      const votesOf = {
        attendee: attendee.name,
        votes: [],
      };
      const findVotesOf = await Vote.find({ attendee: attendee._id });
      votesOf.votes.push(findVotesOf);
      findVotes.push(votesOf);
    }

    const displayEvent = [findEvent, findOptions, findAttendees, findVotes];

    res.json(displayEvent);
  } catch (error) {
    next(error);
  }
});

//display one event by name - Kash
router.get("/events", isLoggedIn, async (req, res, next) => {
  try {
    //comment recupérer l'id de l'user connecté ?
    //car je dois retourner que les events de cet User
    const { name } = req.body;
    const displayEvent = await Event.find({ name });
    res.json(displayEvent);
  } catch (error) {
    next(error);
  }
});

//display one option with option ID - Lau
router.get(
  "/addOption/:userId/eventId/optionId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, eventId, optionId } = req.params;
      const isAttendee = await Attendee.find({ event: eventId, user: userId });
      if (!isAttendee) {
        return res.status(401).json({
          message: "Access denied. You can't access this event information.",
        });
      } else {
        const myOption = await Option.find({ _id: optionId, event: eventId });
        if (!myOption) {
          return res.status(404).json({ message: "No option found.." });
        } else {
          return res.status(201).json(myOption);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

//display all events linked to one user - Kash
router.get("/events/:token");

//display all events - filter by User role isAdmin or not - Lau
router.get(
  "events/role/:userId/:role",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, role } = req.params;
      if (role === "admin") {
        const adminAttendances = await Attendee.find({
          user: userId,
          isAdmin: true,
        });
        const administratedEvents = [];
        adminAttendances.forEach((attendance) => {
          const { event } = attendance;
          const adminEvent = Event.findById(event);
          administratedEvents.push(adminEvent);
        });
        return res.status(201).json(await Promise.all(administratedEvents));
      } else if (role === "notAdmin") {
        const notAdminAttendances = await Attendee.find({
          user: userId,
          isAdmin: false,
        });
        const notAdministratedEvents = [];
        notAdminAttendances.forEach((attendance) => {
          const { event } = attendance;
          const notAdminEvent = Event.findById(event);
          notAdministratedEvents.push(notAdminEvent);
        });
        return res.status(201).json(await Promise.all(notAdministratedEvents));
      }
    } catch (error) {
      next(error);
    }
  }
);

// display all upcoming events linked to a user - Kash
router.get();

//delete event - Lau
router.delete(
  "event/delete/:eventId/:userId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { eventId, userId } = req.params;
      const eventToBeDeleted = await Event.findById(eventId);
      if (eventToBeDeleted.author.toString() !== userId) {
        return res
          .status(400)
          .json({ message: "Access denied. You can't delete this event." });
      } else if (eventToBeDeleted.author.toString() === userId) {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        return res.status(200).json(deletedEvent);
      }
    } catch (error) {
      next(error);
    }
  }
);
//delete options from event - Kash
router.delete();

//remove attendee from an event (isAdmin = true) - Lau --> remove vote also
router.delete(
  "removeAttendee/:userId/:eventId/:attendeeId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, eventId, attendeeId } = req.params;
      const requestorAttendance = await Attendee.find({
        event: eventId,
        user: userId,
      });
      if (!requestorAttendance.isAdmin) {
        return res.status(400).json({
          message:
            "Access denied. You can't remove an attendee from this event.",
        });
      } else {
        const attendeeToBeRemoved = await Attendee.find({
          event: eventId,
          user: attendeeId,
        });
        const voteToBeDeleted = await Vote.find({
          attendee: attendeeToBeRemoved._id,
        });
        const deleteVote = await Vote.findByIdAndDelete(voteToBeDeleted._id);
        const removeAttendee = await Attendee.findByIdAndDelete(
          attendeeToBeRemoved._id
        );
        return res.status(201).json(deleteVote, removeAttendee);
      }
    } catch (error) {
      next(error);
    }
  }
);

// remove user from friend list - Kash
router.delete();

//Update event informations - Lau
router.patch(
  "updateEvent/:userId/:eventId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { userId, eventId } = req.params;
      const requestorAttendance = await Attendee.find({
        event: eventId,
        user: userId,
      });
      if (!requestorAttendance.isAdmin) {
        return res.status(400).json({
          message: "Access denied. You can't modify this event.",
        });
      } else {
        const updatedInfos = [...req.body];
        const updatedEvent = await Event.findByIdAndUpdate(
          eventId,
          updatedInfos
        );
        return res.status(200).json(updatedEvent);
      }
    } catch (error) {
      next(error);
    }
  }
);

//Update options informations (isAdmin = true) - Kash
router.patch();

//Update user profile informations
router.patch(
  "/updateProfile/:userId",
  isAuthenticated,
  async (req, res, next) => {
    const { userId } = req.params;
    const updatedInfos = [...req.body];
    try {
      const user = await User.findByIdAndUpdate({ _id: userId }, updatedInfos, {
        new: true,
      });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

//modify vote
router.patch(
  "updateVote/:attendeeId/:voteId/:firstChoice/:secondChoice/:thirdChoice",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { attendeeId, voteId, firstChoice, secondChoice, thirdChoice } =
        req.params;
      const myVote = await Vote.findById({ _id: voteId });
      if (myVote.attendee !== attendeeId) {
        return res.status(401).json({
          message: "Invalid user, you can't modify this vote.",
        });
      } else {
        myVote = {
          attendeeId,
          firstChoice,
          secondChoice,
          thirdChoice,
        };
        // need to add conditional and to only update the new value (if empty value -> do not update with undefined)
        const updatedVote = Vote.findByIdAndUpdate({ _id: voteId }, myVote, {
          new: true,
        });
        return res.status(201).json(updatedVote);
      }
    } catch (error) {
      next(error);
    }
  }
);

//log out
router.post();

module.exports = router;
