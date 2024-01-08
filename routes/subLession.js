const express = require('express');
const {
  SubLession,
  Reply,
  Comment,
  Lession,
  Course,
  User
} = require('../models/db');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/uploadFile');
const { checkRole, checkUserId } = require('../middleware/authenticateToken');
router.post(
  '/create',
  upload.fields([
    { name: 'sublessonExerciseFile' },
    { name: 'sublessonFile' },
    { name: 'sublessonVideo' }
  ]),
  async (req, res) => {
    try {
      let sublessonExerciseFileUrl, sublessonFileUrl, sublessonVideoUrl;

      // Check if 'lessionId' is present in req.body
      const lessionId = req.body.lessionId;
      if (!lessionId) {
        return res.status(400).json({ error: 'Lession ID is required.' });
      }

      if (req.files.sublessonExerciseFile) {
        // Upload sublessonExerciseFile (PDF) to Cloudinary
        const exerciseFileResponse = await cloudinary.uploader.upload(
          req.files.sublessonExerciseFile[0].path,
          {
            folder: 'Project3',
            resource_type: 'raw'
          }
        );
        sublessonExerciseFileUrl = exerciseFileResponse.secure_url;
      }

      if (req.files.sublessonFile) {
        // Upload sublessonFile (Image) to Cloudinary
        const fileResponse = await cloudinary.uploader.upload(
          req.files.sublessonFile[0].path,
          {
            folder: 'Project3',
            resource_type: 'raw'
          }
        );
        sublessonFileUrl = fileResponse.secure_url;
      }

      if (req.files.sublessonVideo) {
        // Upload sublessonVideo (Video) to Cloudinary
        const videoResponse = await cloudinary.uploader.upload(
          req.files.sublessonVideo[0].path,
          {
            folder: 'Project3',
            resource_type: 'video'
          }
        );
        sublessonVideoUrl = videoResponse.secure_url;
      }

      const newSubLession = await SubLession.create({
        ...req.body,
        lessionId: lessionId,
        subLessionFileExcercise: sublessonExerciseFileUrl,
        subLessionFile: sublessonFileUrl,
        subLessionVideo: sublessonVideoUrl
      });

      res.status(201).json({
        message: 'SubLession created successfully',
        SubLession: newSubLession
      });
    } catch (error) {
      console.error('Error creating subLession:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('/:subLessionId', async (req, res) => {
  const subLessionId = req.params.subLessionId;
  const subLession = await SubLession.findOne({
    where: { id: subLessionId },
    include: [
      {
        model: Comment,
        include: [
          { model: User, attributes: ['id', 'username', 'avatar'] },
          {
            model: Reply,
            include: { model: User, attributes: ['id', 'username', 'avatar'] }
          }
        ]
      },
      {
        model: Lession,
        attributes: ['id', 'lessionTilte', 'courseId'],
        include: [
          {
            model: Course,
            attributes: ['id'],
            include: {
              model: User,
              attributes: ['id', 'username']
            }
          }
        ]
      }
    ]
  });

  if (!subLession) {
    res.status(404).send('subLession not found');
  }
  res.status(200).json(subLession);
});
router.delete('/sublessons/:sublessonId', async (req, res) => {
  const { sublessonId } = req.params;
  try {
    await SubLession.destroy({
      where: { id: sublessonId }
    });
    res.status(200).json({ message: 'Sublesson deleted successfully.' });
  } catch (error) {
    console.error('Error removing sublesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/sublessons/user', checkRole('teacher'), async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('User ID:', userId);

    const subLessons = await SubLession.findAll({
      include: [
        {
          model: Lession,
          attributes: ['id', 'lessionTilte', 'courseId'],
          include: [
            {
              model: Course,
              attributes: ['id'],
              include: {
                model: User,
                where: { id: userId },
                attributes: ['id', 'username']
              }
            }
          ]
        }
      ]
    });
    const filteredSubLessons = subLessons.filter(
      (subLesson) =>
        subLesson.lession &&
        subLesson.lession.course &&
        subLesson.lession.course.user &&
        subLesson.lession.course.user.id === userId
    );
    res.status(200).json(filteredSubLessons);
  } catch (error) {
    console.error('Error fetching subLessons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
