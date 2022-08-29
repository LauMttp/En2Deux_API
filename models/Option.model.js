const { Schema, model } = require("mongoose");

const optionSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  duration: {
    type: Schema.Types.Number,
    required: true,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
  },
  location: {
    type: Schema.Types.String,
    required: true,
  },
});

const Option = model("Option", optionSchema);

module.exports = Option;
