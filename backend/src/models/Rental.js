const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfRental: { type: Date, default: Date.now },
  dateToReturn: { type: Date, required: true }
});

module.exports = mongoose.model('Rental', rentalSchema);
