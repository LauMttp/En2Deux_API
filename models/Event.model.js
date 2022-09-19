const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
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
  dateSuggestion: [Schema.Types.Date, Schema.Types.Date],
  locationSuggestions: [Schema.Types.String],
  startingDate: {
    type: Schema.Types.Date,
  },
  durationInHours: {
    type: Schema.Types.Number,
    required: true,
  },
  location: Schema.Types.String,
  budget: Schema.Types.Number,
  informationGatheringDeadline: Schema.Types.Date,
  votingStageDeadline: {
    type: Schema.Types.Date,
    required: true,
  },
  stage: {
    type: Schema.Types.String,
    enum: [
      "Information gathering",
      "Voting stage",
      "Upcoming",
      "On-going",
      "Finished",
    ],
    default: "Information gathering",
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;
