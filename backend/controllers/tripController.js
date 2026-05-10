
const Trip = require("../models/Trip");

exports.createTrip = async (req, res) => {
  const trip = await Trip.create(req.body);
  res.json(trip);
};

exports.getTrips = async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
};
