const express = require('express');
const { ReviewCourse } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newReviewCourse = await ReviewCourse.create(req.body);
    res.status(201).json({
      message: 'ReviewCourse created successfully',
      ReviewCourse: newReviewCourse
    });
  } catch (error) {
    console.error('Error creating ReviewCourse:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
