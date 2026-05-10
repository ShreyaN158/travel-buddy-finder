const router = require("express").Router();
const Chat = require("../models/chat");

// send message
router.post("/send", async (req, res) => {
  const msg = await Chat.create(req.body);
  res.json(msg);
});

// get messages
router.get("/:user1/:user2", async (req, res) => {
  const msgs = await Chat.find({
    $or: [
      { sender: req.params.user1, receiver: req.params.user2 },
      { sender: req.params.user2, receiver: req.params.user1 }
    ]
  });
  res.json(msgs);
});

module.exports = router;