
const router = require("express").Router();
const ctrl = require("../controllers/tripController");

router.post("/create", ctrl.createTrip);
router.get("/all", ctrl.getTrips);
router.get("/nearby/:lat/:lng", async (req, res) => {

  const lat = parseFloat(req.params.lat);

  const lng = parseFloat(req.params.lng);

  const trips = await Trip.find();

  const nearby = trips.filter(t => {

    if (!t.location) return false;

    const dLat = t.location.lat - lat;

    const dLng = t.location.lng - lng;

    const distance =
      Math.sqrt(dLat * dLat + dLng * dLng);

    return distance < 1;
  });

  res.json(nearby);
});

module.exports = router;
