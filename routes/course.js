const express = require('express');
const { Course } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res
      .status(201)
      .json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allCourses = await Course.findAll();
    res.status(200).json({ courses: allCourses });
  } catch (error) {
    console.error('Error getting all courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
