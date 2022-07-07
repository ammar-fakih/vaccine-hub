const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  try {
    // take user email and password and attempt to authenticate
  } catch (e) {
    next(e)
  }
});

router.post(('/register'), (req, res) => {
  try {
    // take user information and attempt create in user in database
  } catch (e) {
    next(e)
  }
});

module.exports = router