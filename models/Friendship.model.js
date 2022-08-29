const { Schema, model } = require("mongoose");

const friendshipSchema = new Schema({
  requestor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  requested: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: Schema.Types.String,
    enum: ["pending", "accepted", "declined"],
    required: true,
    default: "pending",
  },
});

const friendship = model("Friendship", friendshipSchema);

module.exports = friendship;
