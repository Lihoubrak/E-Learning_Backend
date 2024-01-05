const express = require('express');
const { Reply } = require('../models/db');
const { checkRole } = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/create', checkRole('student'), async (req, res) => {
  try {
    const { parentReplyId } = req.body;
    const userId = req.user.id;
    console.log(req.user);
    // Check if parentReplyId exists and is valid
    if (parentReplyId) {
      const parentReply = await Reply.findByPk(parentReplyId);
      if (!parentReply) {
        return res.status(400).json({ error: 'Invalid parentReplyId' });
      }
    }

    // Create a new reply
    const newReply = await Reply.create({ userId, ...req.body });

    // Respond with success
    res
      .status(201)
      .json({ message: 'Reply created successfully', reply: newReply });
  } catch (error) {
    console.error('Error creating Reply:', error);

    // Respond with an appropriate error message
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
