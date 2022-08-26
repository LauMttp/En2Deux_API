const { Schema, model, SchemaType } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    surname: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    genre: {
      type: Schema.Types.String,
      enum: ["male", "female"],
    },
    phoneNumber: Schema.Types.Number,
    email: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
