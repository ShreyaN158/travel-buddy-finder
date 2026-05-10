const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: String,
  destination: String,
  startDate: String,
  endDate: String,
  interests: [String],
  location: {
  lat: Number,
  lng: Number
},

destinationName: String
});

module.exports = mongoose.model("Trip", tripSchema);