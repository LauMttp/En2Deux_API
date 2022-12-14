const router = require("express").Router();
const Event = require("../models/Event.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin");

const createJob = require("../utils/cronJobEvent");

// Create an event
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      description,
      startingDate,
      durationInHours,
      location,
      budget,
      informationGatheringDeadline,
      votingStageDeadline,
      locationSuggestions,
      dateSuggestion,
    } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid event name." });
    } else {
      const eventCreated = await Event.create({
        name,
        author: req.user.id,
        description,
        startingDate,
        durationInHours,
        dateSuggestion,
        location,
        budget,
        informationGatheringDeadline,
        votingStageDeadline,
        locationSuggestions,
      });
      const { id } = eventCreated;
      const creatorAttendance = await Attendee.create({
        event: id,
        user: req.user.id,
        isAdmin: true,
        status: "accepted",
      });
      return res.status(201).json({ eventCreated, creatorAttendance });
    }
  } catch (error) {
    next(error);
  }
});

//display one event by name
router.get("/searchbyname", async (req, res, next) => {
  try {
    const { name } = req.query;

    const arrEvents = await Attendee.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: {
          path: "$event",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "event.name": name,
        },
      },
    ]);
    return res.status(201).json(arrEvents);
  } catch (error) {
    next(error);
  }
});

// display all upcoming events linked to a Admin or notAdmin
router.get("/upcoming", async (req, res, next) => {
  try {
    const upcomingEvents = await Attendee.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: {
          path: "$event",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "event.stage": "Upcoming",
        },
      },
    ]);
    return res.json(upcomingEvents);
  } catch (error) {
    next(error);
  }
});

//get all event invitations from one user
router.get("/invitations", async (req, res, next) => {
  try {
    const eventInvitations = await Attendee.aggregate([
      {
        $match: {
          user: req.user._id,
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: {
          path: "$event",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.json(eventInvitations);
  } catch (error) {
    next(error);
  }
});

//display all events - filter by User role isAdmin or not
router.get("/byrole/:role", async (req, res, next) => {
  try {
    const { role } = req.params;
    console.log(role);
    if (role === "admin") {
      const administratedEvents = await Attendee.aggregate([
        {
          $match: {
            user: req.user._id,
            isAdmin: true,
            status: "accepted",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: {
            path: "$event",
            preserveNullAndEmptyArrays: false,
          },
        },
      ]);
      return res.status(201).json(await Promise.all(administratedEvents));
    } else if (role === "notAdmin") {
      const notAdministratedEvents = await Attendee.aggregate([
        {
          $match: {
            user: req.user._id,
            isAdmin: false,
            status: "accepted",
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "event",
          },
        },
        {
          $unwind: {
            path: "$event",
            preserveNullAndEmptyArrays: false,
          },
        },
      ]);
      return res.status(201).json(await Promise.all(notAdministratedEvents));
    }
  } catch (error) {
    next(error);
  }
});

//display one event by ID (with attendees, options, votes, etc)
router.get("/:eventId", isAttendee, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const findEvent = await Event.findById(eventId).populate("author");
    const findOptions = await Option.find({ event: eventId });
    const findAttendees = await Attendee.find({ event: eventId }).populate(
      "user"
    );

    let findVotes = [];

    for (let attendee of findAttendees) {
      const votesOf = await Vote.findOne({ attendee: attendee.id });
      findVotes.push(votesOf);
    }

    const displayEvent = {
      event: findEvent,
      options: findOptions,
      attendees: findAttendees,
      votes: findVotes,
    };

    return res.json(displayEvent);
  } catch (error) {
    next(error);
  }
});

//Update event informations
router.patch("/:eventId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const updatedInfos = { ...req.body };
    for (let key in updatedInfos) {
      if (updatedInfos[key] === "") {
        delete updatedInfos[key];
      }
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedInfos, {
      new: true,
    }).populate("author");
    return res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

//delete event
router.delete("/:eventId", isAttendee, isAdmin, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return res.status(200).json(deletedEvent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
