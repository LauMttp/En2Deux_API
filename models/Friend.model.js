const { Schema, model } = require("mongoose");

const friendSchema = new Schema({
  friend1: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  friend2: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Friend = model("Friend", friendSchema);

module.exports = Friend;
