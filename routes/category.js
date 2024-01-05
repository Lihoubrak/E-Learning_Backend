const express = require('express');
const {
  Category,
  CategoryFirst,
  CategorySecond,
  Course,
  User
} = require('../models/db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: CategoryFirst,
        include: {
          model: CategorySecond,
          include: {
            model: Course,
            include: { model: User }
          }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error retrieving categories by category name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findByPk(categoryId, {
      include: {
        model: CategoryFirst,
        include: {
          model: CategorySecond
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error retrieving category by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:categoryFirstId', async (req, res) => {
  try {
    const categoryFirstId = req.params.categoryFirstId;
    const category = await Category.findByPk(categoryFirstId, {
      include: {
        model: CategoryFirst,
        include: {
          model: CategorySecond
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error retrieving category by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
