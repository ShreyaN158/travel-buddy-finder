const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip"
  },

  status: {
    type: String,
    default: "pending"
  }

});

module.exports =
  mongoose.model("Request", requestSchema);
