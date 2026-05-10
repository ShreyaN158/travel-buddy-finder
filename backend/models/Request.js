
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  fromUser: String,
  toUser: String,
  tripId: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Request", requestSchema);
