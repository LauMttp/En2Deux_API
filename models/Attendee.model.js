const { Schema, model } = require("mongoose");

const attendeeSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isAdmin: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
  status: {
    type: Schema.Types.String,
    enum: ["accepted", "declined", "pending"],
    default: "pending"
  },
  // availabilities: [Schema.Types.Date],
  // budget: Schema.Types.Number,
  // location: [Schema.Types.String],
});

const Attendee = model("Attendee", attendeeSchema);

module.exports = Attendee;
