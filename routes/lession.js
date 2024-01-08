const express = require('express');
const {
  Lession,
  SubLession,
  Quiz,
  Question,
  QuestionOption
} = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const { Op } = require('sequelize');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newLession = await Lession.create(req.body);
    res
      .status(201)
      .json({ message: 'Lession created successfully', lession: newLession });
  } catch (error) {
    console.error('Error creating lession:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ error: 'Missing courseId parameter' });
    }

    const lessons = await Lession.findAll({
      where: { courseId: courseId },
      include: { model: SubLession }
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error('Error getting lessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:lessionId', async (req, res) => {
  const { lessionId } = req.params;
  try {
    await Lession.destroy({ where: { id: lessionId } });
    res.status(200).json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    console.error('Error removing lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/quizzes/:lessionId', async (req, res) => {
  try {
    const { lessionId } = req.params;

    // Find the lesson with the specified lessionId, including quizzes
    const lesson = await Lession.findByPk(lessionId, {
      include: [
        { model: SubLession },
        {
          model: Quiz,
          include: { model: Question, include: { model: QuestionOption } }
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.error('Error getting quizzes for lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
