const express = require('express');
const { Comment } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res
      .status(201)
      .json({ message: 'Comment created successfully', Comment: newComment });
  } catch (error) {
    console.error('Error creating Comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
