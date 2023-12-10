const express = require('express');
const { Reply } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { parentReplyId } = req.body;

    // Kiểm tra xem parentReplyId nếu có, có tồn tại không
    if (parentReplyId) {
      const parentReply = await Reply.findByPk(parentReplyId);
      if (!parentReply) {
        return res.status(400).json({ error: 'Invalid parentReplyId' });
      }
    }

    const newReply = await Reply.create(req.body);
    res
      .status(201)
      .json({ message: 'Reply created successfully', reply: newReply });
  } catch (error) {
    console.error('Error creating Reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
