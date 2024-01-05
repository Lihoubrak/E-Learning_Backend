const express = require('express');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models/db');
const { Op } = require('sequelize');
const { generateToken, checkRole } = require('../middleware/authenticateToken');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/uploadImage');
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

    const user = await User.findOne({
      where: { email },
      include: { model: Role }
    });
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
router.get('/infouser', checkRole('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
router.put(
  '/change',
  checkRole('student'),
  upload.single('avatar'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const image = req.file ? req.file : null;
      let updatedAvatarUrl;
      if (image) {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          image.path,
          { folder: 'Project3' }
        );
        updatedAvatarUrl = cloudinaryResponse.secure_url;
      } else {
        updatedAvatarUrl = req.body.imageUrl;
      }

      const userToUpdate = await User.findOne({ where: { id: userId } });

      if (!userToUpdate) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      await userToUpdate.update({
        avatar: updatedAvatarUrl,
        ...req.body
      });

      const updatedUser = await User.findByPk(userId);

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

module.exports = router;
