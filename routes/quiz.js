const express = require('express');
const { Quiz } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json({
      message: 'Quiz created successfully',
      Quiz: newQuiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
