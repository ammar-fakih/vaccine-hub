const express = require('express');
const User = require('../models/users');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    // take user email and password and  attempt to authenticate
    const user = await User.login(req.body);
    return res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    // take user information and attempt create in user in database
    const user = await User.register(req.body); 
    return res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
});

router.post("/transactions", async (req, res, next) => {
  try {
    const transaction = req.body
    console.log("transaction", transaction)
  } catch (err) {
    next(err)
  }
})

module.exports = router;
