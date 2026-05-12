const router = require("express").Router();

const Request = require("../models/Request");

// SEND REQUEST

router.post("/send", async (req, res) => {

  const request =
    await Request.create(req.body);

  res.json(request);

});

// GET REQUESTS

router.get("/:userId", async (req, res) => {

  const requests =
    await Request.find({
      toUser: req.params.userId
    })

    .populate("fromUser", "name")
    .populate("toUser", "name");

  res.json(requests);

});

// ACCEPT REQUEST

router.put("/accept/:id", async (req, res) => {

  const updated =
    await Request.findByIdAndUpdate(

      req.params.id,

      {
        status: "accepted"
      },

      {
        new: true
      }

    );

  res.json(updated);

});

// REJECT REQUEST

router.put("/reject/:id", async (req, res) => {

  const updated =
    await Request.findByIdAndUpdate(

      req.params.id,

      {
        status: "rejected"
      },

      {
        new: true
      }

    );

  res.json(updated);

});

module.exports = router;