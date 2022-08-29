const { Schema, model } = require("mongoose");

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
  description: {
    type: Schema.Types.String,
    maxLength: 250,
  },
  //dateSuggestion: [Schema.Types.Date, Schema.Types.Date],
  //locationSuggestions: [Schema.Types.String],
  startingDate: {
    type: Schema.Types.Date,
  },
  durationInHours: Schema.Types.Number,
  location: Schema.Types.String,
  budget: Schema.Types.Number,
  //informationGatheringDeadline: Schema.Types.Date,
  votingStageDeadline: Schema.Types.Date,
  stage: {
    type: Schema.Types.String,
    enum: ["Information gathering", "Voting stage", "Upcoming", "On-going", "Finished"],
    default: "Voting stage",
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;
