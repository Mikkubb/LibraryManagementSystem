const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: Number, unique: true, index: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  isbn: { type: String, required: true },
  copies: { type: Number, required: true }
});

bookSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastBook = await mongoose.model('Book').findOne().sort({ bookId: -1 });
    this.bookId = lastBook ? lastBook.bookId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
