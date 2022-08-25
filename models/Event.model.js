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

const Event = model("Event", eventSchema);

module.exports = Event;
