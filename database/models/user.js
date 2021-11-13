const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: "https://i.ibb.co/qDBXYyC/Dise-o-sin-t-tulo-2.png",
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  friends: {
    type: [Types.ObjectId],
    ref: "Users",
    required: true,
  },
  bio: {
    type: String,
    required: true,
    default: "Esto está perfe. ¿Mini de fuet?",
  },
});

const User = model("User", userSchema, "Users");

module.exports = User;
