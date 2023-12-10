const express = require('express');
const { SubLession, Reply, Comment } = require('../models/db');
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
router.get('/:subLessionId', async (req, res) => {
  const subLessionId = req.params.subLessionId;
  const subLession = await SubLession.findOne({
    where: { id: subLessionId },
    include: { model: Comment, include: { model: Reply } }
  });
  if (!subLession) {
    res.status(404).send('subLession not found');
  }
  res.status(200).json(subLession);
});
module.exports = router;
