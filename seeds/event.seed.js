require('dotenv').config()
require('../db')
const Event = require("../models/Event.model");
const mongoose = require('mongoose');

const events = [
    {
        name: 'Iron',
        author:
        surname: 'zemfzgjzlgj',
        password: 'Usddfgdfhdfh234!',
        genre: 'stupid',
        phoneNumber: 05623522352253,
        address: "9 avenue de la fameeee, 93100, Le ZOOOOOO",
        email: 'agashDKash@mail.com',
      },
]
const eventSchema = new Schema({
    name: {
      type: Schema.Types.String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    bio: {
      type: Schema.Types.String,
      maxLength: 250,
    },
    dateSuggestion: {
      type: [Schema.Types.Date],
      maxLength: 2,
    },
    locationSuggestions: [Schema.Types.String],
    date: {
      type: Schema.Types.Date,
    },
    location: Schema.Types.String,
    budget: Schema.Types.Number,
    informationGatheringDeadline: Schema.Types.Date,
    votingStageDeadline: Schema.Types.Date,
    stage: {
      type: Schema.Types.String,
      enum: ["Information gathering", "Voting stage", "On-going", "Finished"],
    },
  });
  

async function seedTheData(newEvents) {
    console.log("Deleting previous events...");
    try{
        await Event.deleteMany()
        const createEvents = Event.create(newEvents);
        console.log(`${createEvents.length} events created !`);
        await mongoose.disconnect();
    }
    catch(error){
        console.error(error.message)
    }
}

seedTheData(events)
