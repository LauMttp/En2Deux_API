require("dotenv").config();
require("../db");
const Event = require("../models/Event.model");
const mongoose = require("mongoose");
const User = require('./../models/User.model')

const events = [
  {
    name: "Ironbeer",
    author: "idNeeded",
    description: "drink free beers and get drunk!",
    startingDate: new Date(2022 - 09 - 04),
    durationInHours: 5,
    location: "Deskopolitan Voltaire",
    budget: 20,
    votingStageDeadline: new Date(2022 - 08 - 29),
    stage: "Voting stage",
  },
  {
    name: "Project 2 - Presentation",
    author: "idNeeded",
    description: "Let's present our backends!",
    startingDate: new Date(2022 - 09 - 05),
    durationInHours: 8,
    location: "Deskopolitan Voltaire",
    votingStageDeadline: new Date(2022 - 09 - 02),
    stage: "Voting stage",
  },
  {
    name: "Iron alumni party",
    author: "idNeeded",
    description: "Let's meet up again!",
    votingStageDeadline: new Date(2022 - 09 - 30),
    stage: "Voting stage",
  },
];

async function seedTheData(newEvents) {
  console.log("Deleting previous events...");
  try {
    const allUsers = await User.find()
    await Event.deleteMany();
    for (const event of events) {
      event.author = getRandomId(allUsers)
    }
    const createEvents = await Event.create(newEvents);
    console.log(`${createEvents.length} events created !`);
    await mongoose.disconnect();
  } catch (error) {
    console.error(error.message);
  }
}

function getRandomId(array) {
  return array[Math.floor(Math.random() * array.length)]._id
}
seedTheData(events);
