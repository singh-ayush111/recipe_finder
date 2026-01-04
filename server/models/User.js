const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [
    {
      id: String,
      title: String,
      image: String,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);