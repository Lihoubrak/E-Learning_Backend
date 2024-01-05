const express = require('express');
const {
  Course,
  Lession,
  SubLession,
  Quiz,
  CategorySecond,
  User,
  CategoryFirst,
  Category,
  ReviewCourse,
  Comment
} = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();
router.post('/create', checkRole('teacher'), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const newCourse = await Course.create({ userId: teacherId, ...req.body });
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
    const allCourses = await Course.findAll({
      include: [
        {
          model: CategorySecond,
          include: {
            model: CategoryFirst,
            include: {
              model: Category
            }
          }
        },
        {
          model: User
        },
        {
          model: Lession,
          include: [
            {
              model: SubLession,
              include: { model: Comment }
            },
            {
              model: Quiz
            }
          ]
        }
      ]
    });

    res.status(200).json(allCourses);
  } catch (error) {
    console.error('Error getting all courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findOne({
    where: { id: courseId },
    include: [
      {
        model: Lession,
        include: [
          {
            model: SubLession
          },
          {
            model: Quiz
          }
        ]
      },
      {
        model: User
      },
      {
        model: ReviewCourse,
        include: { model: User, attributes: ['id', 'username', 'avatar'] }
      }
    ]
  });

  if (!course) {
    res.status(404).send('course not found');
  }
  res.status(200).json(course);
});
router.get('/byCategory/:cateId', async (req, res) => {
  const cateId = req.params.cateId;

  try {
    const coursesByCategory = await Course.findAll({
      include: [
        {
          model: CategorySecond,
          where: { categoryFirstId: cateId },
          include: {
            model: CategoryFirst,
            include: {
              model: Category
            }
          }
        },
        {
          model: User
        },
        {
          model: Lession,
          include: [
            {
              model: SubLession
            },
            {
              model: Quiz
            }
          ]
        }
      ]
    });

    res.status(200).json(coursesByCategory);
  } catch (error) {
    console.error('Error getting courses by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
