const express = require('express');
const { Question } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json({
      message: 'Question created successfully',
      Question: newQuestion
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
