const express = require('express');
const { Enrollment } = require('../models/db');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const newEnrollment = await Enrollment.create(req.body);
    res
      .status(201)
      .json({
        message: 'Enrollment created successfully',
        Enrollment: newEnrollment
      });
  } catch (error) {
    console.error('Error creating Enrollment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
