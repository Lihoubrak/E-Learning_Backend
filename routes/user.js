const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/db');
const { Op } = require('sequelize');
const { generateToken } = require('../middleware/authenticateToken');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password, confirmPassword, roleId } =
      req.body;
    if (!username || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      roleId
    });

    res
      .status(201)
      .json({ message: 'Registration successful.', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful.', user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
module.exports = router;
