const { Schema, model, SchemaType } = require("mongoose");

const voteSchema = new Schema({
  attendee: {
    type: Schema.Types.ObjectId,
    ref: "Attendee",
    unique: true,
    require: true,
  },
  firstChoice: {
    type: Schema.Types.ObjectId,
    ref: "Option",
    require: true,
  },
  secondChoice: {
    type: Schema.Types.ObjectId,
    ref: "Option",
  },
  thirdChoice: {
    type: Schema.Types.ObjectId,
    ref: "Option",
  },
});

const Vote = model("Vote", voteSchema);

module.exports = Vote;
