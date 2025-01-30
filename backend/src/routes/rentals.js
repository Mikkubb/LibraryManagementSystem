const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const User = require('../models/User');
const Book = require('../models/Book');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRole = require('../middleware/authorizeRole');

// Endpoint do pobierania wszystkich wypożyczeń (dla administratora i bibliotekarza)
router.get('/', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'userId email')
      .populate('book', 'bookId title');
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do pobierania wypożyczeń dla konkretnego użytkownika
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rentals = await Rental.find({ user: user._id })
      .populate('user', 'userId email')
      .populate('book', 'bookId title');
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do wypożyczenia książki (dla administratora i bibliotekarza)
router.post('/rent', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  const { bookId, userId, dateToReturn } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findOne({ bookId });
    if (!book || book.copies < 1) return res.status(404).json({ message: 'Book not available' });

    const rental = new Rental({
      user: user._id,
      book: book._id,
      dateOfRental: new Date(),
      dateToReturn,
    });

    await rental.save();
    book.copies -= 1;
    await book.save();

    res.status(201).json({ message: 'Book rented successfully', rental });
  } catch (error) {
    console.error('Error renting book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do przedłużenia terminu zwrotu wypożyczenia (dla administratora i bibliotekarza)
router.post('/postpone/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  const { id } = req.params;
  const { newDateToReturn } = req.body;

  try {
    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.dateToReturn = newDateToReturn;
    await rental.save();

    res.status(200).json({ message: 'Return date postponed successfully', rental });
  } catch (error) {
    console.error('Error postponing rental:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do zwrotu książki (dla administratora i bibliotekarza)
router.post('/return/:id', authenticateToken, authorizeRole(['admin', 'librarian']), async (req, res) => {
  const { id } = req.params;

  try {
    const rental = await Rental.findById(id).populate('book');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.book.copies += 1;
    await rental.book.save();
    await Rental.findByIdAndDelete(id);

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
