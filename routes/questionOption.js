const express = require('express');
const { QuestionOption } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newQuestionOption = await QuestionOption.create(req.body);
    res.status(201).json({
      message: 'QuestionOption created successfully',
      QuestionOption: newQuestionOption
    });
  } catch (error) {
    console.error('Error creating questionOption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
