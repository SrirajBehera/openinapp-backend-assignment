const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validateCreateUserInput } = require("../validator");
const User = mongoose.model("User");

router.post("/api/user", (req, res) => {
  const { phoneNumber, priority } = req.body;

  const validation = validateCreateUserInput(phoneNumber, priority);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  const user = new User({
    phone_num: phoneNumber,
    priority: priority,
  });

  user
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not create user" });
    });
});

router.get("/api/token/:userId", (req, res) => {
  const user_id = req.params.userId;
  User.findById(user_id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET_KEY);
      res.json({ token });
    })
    .catch((err) => {
      console.error("Error searching for user:", err);
      res.status(500).json({ error: "Error generating JWT" });
    });
});

module.exports = router;
