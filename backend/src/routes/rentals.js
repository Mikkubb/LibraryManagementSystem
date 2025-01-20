const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const User = require('../models/User');
const Book = require('../models/Book');

// Endpoint do pobierania wszystkich wypożyczeń
router.get('/', async (req, res) => {
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

// Endpoint do wypożyczenia książki
router.post('/rent', async (req, res) => {
  const { bookId, userId, dateToReturn } = req.body;

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findOne({ bookId: bookId });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.copies < 1) {
      return res.status(400).json({ message: 'No copies available' });
    }

    const rental = new Rental({
      user: user._id,
      book: book._id,
      dateOfRental: new Date(),
      dateToReturn: dateToReturn,
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

// Endpoint do przedłużenia terminu zwrotu wypożyczenia
router.post('/postpone/:id', async (req, res) => {
  const rentalId = req.params.id;
  const { newDateToReturn } = req.body;

  try {
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.dateToReturn = newDateToReturn;
    await rental.save();

    res.status(200).json({ message: 'Return date postponed successfully', rental });
  } catch (error) {
    console.error('Error postponing rental:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do zwrotu książki
router.post('/return/:id', async (req, res) => {
  const rentalId = req.params.id;

  try {
    const rental = await Rental.findById(rentalId).populate('book');
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.book.copies += 1;
    await rental.book.save();

    await Rental.findByIdAndDelete(rentalId);

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
