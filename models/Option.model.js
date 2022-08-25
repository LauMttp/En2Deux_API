const { Schema, model } = require("mongoose");

const optionSchema = new Schema({
    date: Schema.Types.Date,
    duration: Schema.Types.Number,
    price: Schema.Types.Number,
    location: Schema.Types.String,
});

const Option = model("Option", optionSchema);

module.exports = Option;
