const router = require("express").Router();
const Request = require("../models/Request");

// send request
router.post("/send", async (req, res) => {
  const request = await Request.create(req.body);
  res.json(request);
});

// get requests
router.get("/:userId", async (req, res) => {
  const requests = await Request.find({ toUser: req.params.userId });
  res.json(requests);
});

// accept request
router.put("/accept/:id", async (req, res) => {
  const updated = await Request.findByIdAndUpdate(
    req.params.id,
    { status: "accepted" },
    { new: true }
  );
  res.json(updated);
});

// reject request
router.put("/reject/:id", async (req, res) => {
  const updated = await Request.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;