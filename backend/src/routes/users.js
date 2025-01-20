const express = require('express');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');
const router = express.Router();

// Pobierz listę wszystkich użytkowników (z wykluczeniem adminów, dostępne dla admina i bibliotekarza)
router.get('/', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pobierz szczegóły użytkownika (dostępne dla admina i bibliotekarza)
router.get('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edycja danych użytkownika (bez edycji roli, dostępne dla admina i bibliotekarza)
router.put('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const updateFields = { email, firstName, lastName };
  if (password) updateFields.password = password;

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Usuń użytkownika (dostępne dla admina i bibliotekarza)
router.delete('/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
