const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const booksRouter = require('./routes/books');
const authRouter = require('./routes/auth');
const rentalsRouter = require('./routes/rentals');
const usersRouter = require('./routes/users');

app.use('/api/books', booksRouter);
app.use('/api/auth', authRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});