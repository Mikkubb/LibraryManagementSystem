const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opinion: { type: String, required: true, maxlength: 500 },
  rate: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model('Review', reviewSchema);
