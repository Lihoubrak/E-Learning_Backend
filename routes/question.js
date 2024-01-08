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

router.delete('/delete/:questionId', async (req, res) => {
  const { questionId } = req.params;

  try {
    const questionToDelete = await Question.findByPk(questionId);
    if (!questionToDelete) {
      return res.status(404).json({ error: 'Question not found' });
    }
    await questionToDelete.destroy();
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
