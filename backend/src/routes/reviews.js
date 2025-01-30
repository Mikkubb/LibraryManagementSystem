const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');

// Endpoint do pobierania recenzji dla danej książki
router.get('/:bookId', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'userId firstName');
    const reviewsWithFallback = reviews.map(review => ({
      ...review.toObject(),
      user: review.user || { userId: 'Anonymous', firstName: 'ND' },
    }));
    res.json(reviewsWithFallback);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do dodawania recenzji
router.post('/', authenticateToken, async (req, res) => {
  const { bookId, userId, opinion, rate } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      console.error("Book not found with ID:", bookId);
      return res.status(404).json({ message: 'Book not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const review = new Review({
      book: bookId,
      user: userId,
      opinion,
      rate,
    });

    const savedReview = await review.save();
    const populatedReview = await savedReview.populate('user', 'userId firstName');

    res.status(201).json({ review: populatedReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint do usuwania recenzji
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
