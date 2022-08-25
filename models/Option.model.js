const { Schema, model } = require("mongoose");

const optionSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
    },
    date: Schema.Types.Date,
    duration: Schema.Types.Number,
    price: Schema.Types.Number,
    location: Schema.Types.String,
});

const Option = model("Option", optionSchema);

module.exports = Option;
