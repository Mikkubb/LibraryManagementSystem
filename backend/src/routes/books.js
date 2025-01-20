const express = require('express');
const Book = require('../models/Book');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Pobieranie książek - dostępne tylko dla zalogowanych użytkowników
router.get('/', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dodawanie nowej książki - dostępne tylko dla admina i bibliotekarza
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { title, author, genre, isbn, copies } = req.body;

  try {
    const newBook = new Book({ title, author, genre, isbn, copies });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Usuwanie książki - dostępne tylko dla admina i bibliotekarza
router.delete('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
