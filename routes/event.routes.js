const router = require("express").Router();

const Event = require("../models/Event.model");
const Attendee = require("../models/Attendee.model");
const Option = require("../models/Option.model");
const Vote = require("../models/Vote.model");

// Create an event  - Lau
router.post("/", async (req, res, next) => {
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
    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a valid event name." });
    } else {
      const eventCreated = await Event.create({
        name,
        author: req.user.id,
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
        user: req.user.id,
        isAdmin: true,
      });
      return res.status(201).json(eventCreated, creatorAttendance);
    }
  } catch (error) {
    next(error);
  }
});

//display one event by ID (with attendees, options, votes, etc) - Kash

router.get("/byid/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const findEvent = await Event.findById(eventId);
    const findOptions = await Option.find({ event: eventId });
    const findAttendees = await Attendee.find({ event: eventId });

    let findVotes = [];
    for (let attendee of findAttendees) {
      const votesOf = await Vote.find({ attendee: attendee._id });
      findVotes.votes.push(votesOf);
    }
    const displayEvent = [findEvent, findOptions, findAttendees, findVotes];

    return res.json(displayEvent);
  } catch (error) {
    next(error);
  }
});

//display one event by name - Kash
router.get("/searchbyname", async (req, res, next) => {
  try {
    const { name } = req.body;
    const findAttendance = await Attendee.find({ user: req.user._id }).populate(
      "event"
    );
    const arrEvents = [];
    for (let attendance of findAttendance) {
      if (attendance.event.name === name) {
        arrEvents.push(attendance.event);
      }
    }
    // check status number
    return res.status(201).json(arrEvents);
  } catch (error) {
    next(error);
  }
});

// display all upcoming events linked to a Admin - Kash
router.get("/upcoming/admin", async (req, res, next) => {
  try {
    const findAttendanceAdmin = Attendee.find({
      user: req.user._id,
      isAdmin: true,
    }).populate("event");
    // ------------- > CAN'T USE FIND WITH A VARIABLE --> TO BE UPDATED
    const findUpcoming = await findAttendanceAdmin.event.find({
      author: req.user._id,
      stage: "Upcoming",
    });
    return res.json(findUpcoming);
  } catch (error) {
    next(error);
  }
});

// display all upcoming events linked to a notAdmin attendee - Kash
router.get("/upcoming/notadmin", async (req, res, next) => {
  try {
    const findAttendance = Attendee.find({
      user: req.user._id,
      isAdmin: false,
    }).populate("event");
    // ------------- > CAN'T USE FIND WITH A VARIABLE --> TO BE UPDATED
    const findUpcoming = await findAttendance.event.find({
      author: req.user._id,
      stage: "Upcoming",
    });
    return res.json(findUpcoming);
  } catch (error) {
    next(error);
  }
});

//display all events - filter by User role isAdmin or not - Lau
router.get("allevents/byrole/:role", async (req, res, next) => {
  try {
    const { role } = req.params;
    if (role === "admin") {
      const adminAttendances = await Attendee.find({
        user: req.user._id,
        isAdmin: true,
      });
      const administratedEvents = [];
      adminAttendances.forEach((attendance) => {
        // const { event } = attendance; --> CHECK AND DELETE
        const adminEvent = Event.findById(attendance.event);
        administratedEvents.push(adminEvent);
      });
      return res.status(201).json(await Promise.all(administratedEvents));
    } else if (role === "notAdmin") {
      const notAdminAttendances = await Attendee.find({
        user: req.user._id,
        isAdmin: false,
      });
      const notAdministratedEvents = [];
      notAdminAttendances.forEach((attendance) => {
        // const { event } = attendance; ---> CAN DIRECTLY CALL attendance.event CHECK AND DELETE
        const notAdminEvent = Event.findById(attendance.event);
        notAdministratedEvents.push(notAdminEvent);
      });
      return res.status(201).json(await Promise.all(notAdministratedEvents));
    }
  } catch (error) {
    next(error);
  }
});

//Update event informations - Lau
router.patch("/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const requestorAttendance = await Attendee.find({
      event: eventId,
      user: req.user._id,
    });
    if (!requestorAttendance.isAdmin) {
      return res.status(400).json({
        message: "Access denied. You can't modify this event.",
      });
    } else {
      const updatedInfos = { ...req.body };
      for (let key in updatedInfos) {
        if (updatedInfos[key] === "" && key !== "description") {
          delete updatedInfos[key];
        }
      }
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        updatedInfos,
        { new: true }
      );
      return res.status(200).json(updatedEvent);
    }
  } catch (error) {
    next(error);
  }
});

//delete event - Lau
router.delete("/:eventId", async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const eventToBeDeleted = await Event.findById(eventId);
    if (eventToBeDeleted.author.toString() !== req.user.id) {
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
});

module.exports = router;
