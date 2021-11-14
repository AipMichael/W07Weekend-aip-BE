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
  photo: {
    type: String,
    default: "https://i.ibb.co/qDBXYyC/Dise-o-sin-t-tulo-2.png",
  },
  enemies: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },
  friends: {
    type: [Types.ObjectId],
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
    default: "Esto está perfe. ¿Mini de fuet?",
  },
});

const User = model("User", userSchema, "Users");

module.exports = User;
