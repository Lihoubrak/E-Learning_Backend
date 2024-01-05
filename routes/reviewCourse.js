const express = require('express');
const { ReviewCourse } = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const newReviewCourse = await ReviewCourse.create({ userId, ...req.body });
    res.status(201).json(newReviewCourse);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
