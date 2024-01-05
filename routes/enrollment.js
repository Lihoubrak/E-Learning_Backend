const express = require('express');
const {
  Enrollment,
  Course,
  User,
  Lession,
  SubLession,
  Quiz,
  Comment
} = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const newEnrollment = await Enrollment.create({ userId, ...req.body });
    res.status(201).json({
      message: 'Enrollment created successfully',
      Enrollment: newEnrollment
    });
  } catch (error) {
    console.error('Error creating Enrollment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get all courses for a specific user
router.get('/courses', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const userEnrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          include: [
            { model: User },
            {
              model: Lession,
              include: [
                { model: Quiz },
                { model: SubLession, include: { model: Comment } }
              ]
            }
          ]
        }
      ]
    });

    res.status(200).json(userEnrollments);
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get(
  '/check-enrollment/:courseId',
  checkRole('student'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const courseId = req.params.courseId;

      const enrollment = await Enrollment.findOne({
        where: { userId, courseId },
        include: [{ model: Course }]
      });

      if (enrollment) {
        res.status(200).json({
          enrolled: true,
          courseId: enrollment.courseId
        });
      } else {
        res.status(200).json({
          enrolled: false
        });
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
