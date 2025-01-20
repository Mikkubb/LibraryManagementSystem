const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'librarian', 'admin'], default: 'user' }
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastUser = await mongoose.model('User').findOne().sort({ userId: -1 });
    this.userId = lastUser ? lastUser.userId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
