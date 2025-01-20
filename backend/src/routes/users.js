const express = require('express');
const User = require('../models/User');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Pobierz listę wszystkich użytkowników (tylko dla admina)
router.get('/', authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Zmień rolę użytkownika (tylko dla admina)
router.put('/:id/role', authorizeRole('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['user', 'librarian', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Usuń użytkownika (tylko dla admina)
router.delete('/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
