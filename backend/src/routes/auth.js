const express = require('express');
const User = require('../models/User');
const Rental = require('../models/Rental');
const Review = require('../models/Review');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Endpoint rejestracji nowego użytkownika
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user'
    });
    

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint rejestracji bibliotekarza (dostępny tylko dla adminów)
router.post('/registerLibrarian', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'librarian'
    });

    await user.save();
    res.status(201).json({ message: 'Librarian added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint logowania użytkownika
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

    res.json({
      token,
      role: user.role,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        _id: user._id,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint aktualizacji profilu użytkownika
router.put('/update', authenticateToken, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint do usuwania profilu użytkownika
router.delete('/delete', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeRentals = await Rental.find({ user: userId });
    if (activeRentals.length > 0) {
      return res.status(400).json({ message: 'User has active rentals and cannot be deleted.' });
    }

    await Review.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully, including associated reviews.' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
