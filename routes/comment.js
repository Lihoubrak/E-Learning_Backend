const express = require('express');
const { Comment, User, Reply } = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const newComment = await Comment.create({ userId, ...req.body });
    res
      .status(201)
      .json({ message: 'Comment created successfully', Comment: newComment });
  } catch (error) {
    console.error('Error creating Comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/getAll/:subLessionID', async (req, res) => {
  try {
    const subLessionID = req.params.subLessionID;
    const comments = await Comment.findAll({
      where: { subLessionId: subLessionID },
      include: [{ model: User }, { model: Reply, include: { model: User } }]
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
