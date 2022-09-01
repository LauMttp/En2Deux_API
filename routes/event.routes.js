const router = require("express").Router();
const Event = require("../models/Event.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");
const isAttendee = require("../middleware/isAttendee");
const isAdmin = require("../middleware/isAdmin");
const createJob = require("./utils/cronJobEvent");

// Create an event
router.post("/", async (req, res, next) => {
  try {
    const newEvent = { ...req.body };
    newEvent.author = req.user.id;
    if (!newEvent.name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid event name." });
    } else if (
      (!newEvent.startingDate && !newEvent.dateSuggestion) ||
      (!newEvent.durationInHours && !newEvent.dateSuggestion)
    ) {
      return res.status(400).json({
        message:
          "Please provide either the event's date and duration or a time range for your guests to indicate their availabilities.",
      });
    } else if (!newEvent.location && !newEvent.locationSuggestions) {
      return res.status(400).json({
        message:
          "Please provide either the event's location or several proposals for which your guests will be able to vote.",
      });
    } else if (
      (!newEvent.startingDate &&
        !newEvent.durationInHours &&
        !newEvent.informationGatheringDeadline) ||
      (!newEvent.location && !newEvent.informationGatheringDeadline)
    ) {
      return res.status(400).json({
        message: "Please provide an information gathering deadline.",
      });
    } else if (!newEvent.votingStageDeadline) {
      return res.status(400).json({
        message: "Please provide a voting stage deadline.",
      });
    } else if (!newEvent.informationGatheringDeadline) {
      newEvent.stage = "Voting stage";
    } else {
      const eventCreated = await Event.create(newEvent);
      const { _id } = eventCreated;
      const creatorAttendance = await Attendee.create({
        event: _id,
        user: req.user.id,
        isAdmin: true,
        status: "accepted",
      });
      createJob(eventCreated);
      return res.status(201).json({ eventCreated, creatorAttendance });
    }
  } catch (error) {
    next(error);
  }
});

//display one event by ID (with attendees, options, votes, etc)
router.get("/byid/:eventId", isAttendee, async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const findEvent = await Event.findById(eventId);
    const findOptions = await Option.find({ event: eventId });
    const findAttendees = await Attendee.find({ event: eventId });
    let findVotes = [];
    for (let attendee of findAttendees) {
      const votesOf = await Vote.findOne({ attendee: attendee._id });
      findVotes.votes.push(votesOf);
    }
    const displayEvent = [findEvent, findOptions, findAttendees, findVotes];
    return res.json(displayEvent);
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
          preserveNullAndEmptyArrays: false,
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
router.get("/upcoming/:role", async (req, res, next) => {
  try {
    const { role } = req.params;
    if (role === "admin") {
      const adminUpcoming = await Attendee.aggregate([
        {
          $match: {
            user: req.user._id,
            isAdmin: true,
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
        {
          $match: {
            "event.stage": "Upcoming",
          },
        },
      ]);
      return res.json(adminUpcoming);
    } else if (role === "notAdmin") {
      const notAdminUpcoming = await Attendee.aggregate([
        {
          $match: {
            user: req.user._id,
            isAdmin: false,
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
        {
          $match: {
            "event.stage": "Upcoming",
          },
        },
      ]);
      return res.json(notAdminUpcoming);
    } else {
      return res.status(404).json({
        message:
          "Request not found. Please select upcoming event as Admin or Attendee.",
      });
    }
  } catch (error) {
    next(error);
  }
});

//display all events - filter by User role isAdmin or not
router.get("allevents/byrole/:role", async (req, res, next) => {
  try {
    const { role } = req.params;
    if (role === "admin") {
      const administratedEvents = await Attendee.aggregate([
        {
          $match: {
            user: req.user._id,
            isAdmin: true,
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
    });
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
