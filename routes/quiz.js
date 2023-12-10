const express = require('express');
const { Quiz, Question, QuestionOption } = require('../models/db');
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

router.get('/:quizId', async (req, res) => {
  const quizId = req.params.quizId;
  const quiz = await Quiz.findOne({
    where: { id: quizId },
    include: { model: Question, include: { model: QuestionOption } }
  });
  if (!quiz) {
    res.status(404).send('Quiz not found');
  }
  res.status(200).json(quiz);
});
module.exports = router;
