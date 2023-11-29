const express = require('express');
const { Lession } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newLession = await Lession.create(req.body);
    res
      .status(201)
      .json({ message: 'Lession created successfully', lession: newLession });
  } catch (error) {
    console.error('Error creating lession:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
