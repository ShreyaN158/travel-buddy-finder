
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  bio: {
    type: String,
    default: ""
  },

  profilePic: {
    type: String,
    default: ""
  },

  interests: [String],

  location: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);