const express = require('express');
const { Course, Lession, SubLession, Quiz } = require('../models/db');
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

router.get('/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findOne({
    where: { id: courseId },
    include: {
      model: Lession,
      include: {
        model: SubLession,
        include: {
          model: Quiz
        }
      }
    }
  });

  if (!course) {
    res.status(404).send('course not found');
  }
  res.status(200).json(course);
});
module.exports = router;
