// models/Class.js

const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }], // Reference to Quiz
});

module.exports = mongoose.model('Class', ClassSchema);
