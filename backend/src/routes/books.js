const express = require('express');
const Book = require('../models/Book');
const Rental = require('../models/Rental');
const Review = require('../models/Review');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Pobieranie wszystkich książek - dostępne tylko dla zalogowanych użytkowników
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

// Pobieranie szczegółów książki - dostępne tylko dla zalogowanych użytkowników
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aktualizacja książki - dostępne tylko dla admina i bibliotekarza
router.put('/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { title, author, genre, isbn, copies } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, isbn, copies },
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
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
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    
    const activeRentals = await Rental.find({ book: book._id });
    if (activeRentals.length > 0) {
      return res.status(400).json({ message: 'Book is currently rented and cannot be deleted.' });
    }

    
    await Review.deleteMany({ book: book._id });

    
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully, including associated reviews.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
