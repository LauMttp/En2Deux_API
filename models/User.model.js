const { Schema, model, SchemaType } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      require: true,
    },
    name: {
      type: Schema.Types.String,
      require: true,
    },
    surname: {
      type: Schema.Types.String,
      require: true,
    },
    password: {
      type: Schema.Types.String,
      require: true,
    },
    genre: {
      type: Schema.Types.String,
      enum: ["male", "female", "stupid", "shemale"],
    },
    phoneNumber: Schema.Types.Number,
    address: Schema.Types.String,
    email: Schema.Types.String,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
