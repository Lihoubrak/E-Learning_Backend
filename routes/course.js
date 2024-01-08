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
  Comment,
  Reply
} = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploadImage');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
router.post(
  '/create',
  checkRole('teacher'),
  upload.single('courseImage'),
  async (req, res) => {
    try {
      const teacherId = req.user.id;
      const image = req.file ? req.file : null;
      if (image) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image.path,
          {
            folder: 'Project3'
          }
        );
        updatedAvatarUrl = cloudinaryResponse.secure_url;
      }
      const newCourse = await Course.create(
        {
          userId: teacherId,
          courseImage: updatedAvatarUrl,
          ...req.body
        },
        { include: { model: User } }
      );
      res
        .status(201)
        .json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
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
            model: SubLession,
            include: {
              model: Comment,
              include: [
                { model: User }, // Include User model within Comment model
                { model: Reply, include: { model: User } }
              ]
            }
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
router.get('/course/teacher', checkRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;

  try {
    const coursesByTeacher = await Course.findAll({
      where: { userId: teacherId }, // Add a comma here
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

    res.status(200).json(coursesByTeacher);
  } catch (error) {
    console.error('Error getting courses by teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete('/delete/:courseId', checkRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;
  const courseId = req.params.courseId;
  try {
    const course = await Course.findOne({
      where: { id: courseId, userId: teacherId }
    });

    if (!course) {
      return res
        .status(404)
        .json({ error: 'Course not found or does not belong to the teacher.' });
    }
    await Course.destroy({ where: { id: courseId } });
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
