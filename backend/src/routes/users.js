const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Rental = require('../models/Rental');
const Review = require('../models/Review');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Endpoint do pobierania listy użytkowników (z wykluczeniem adminów, dostępne dla admina i bibliotekarza)
router.get('/', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do pobierania szczegółów konkretnego użytkownika (dostępne dla admina i bibliotekarza)
router.get('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do edycji danych użytkownika (dostępne dla admina i bibliotekarza)
router.put('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const updateFields = { email, firstName, lastName };

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint do usuwania użytkownika (dostępne dla admina i bibliotekarza)
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeRentals = await Rental.find({ user: user._id });
    if (activeRentals.length > 0) {
      return res.status(400).json({ message: 'User has active rentals and cannot be deleted.' });
    }

    await Review.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully, including associated reviews.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
