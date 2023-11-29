const express = require('express');
const { SubLession } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newSubLession = await SubLession.create(req.body);
    res.status(201).json({
      message: 'SubLession created successfully',
      SubLession: newSubLession
    });
  } catch (error) {
    console.error('Error creating subLession:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
