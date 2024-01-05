const express = require('express');
const { UserAnswer } = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const newUserAnswer = await UserAnswer.create({ userId, ...req.body });
    res.status(201).json({
      message: 'UserAnswer created successfully',
      UserAnswer: newUserAnswer
    });
  } catch (error) {
    console.error('Error creating UserAnswer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
