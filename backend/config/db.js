
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://shreyanayak329:1508@cluster0.sq6omcp.mongodb.net/travelBuddy");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
