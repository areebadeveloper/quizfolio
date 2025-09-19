const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  startTime: { type: Date, default: Date.now }, // When the user starts the quiz
  endTime: { type: Date }, // When the user finishes or time expires
  score: { type: Number, default: 0 }, // Optional: can be calculated based on answers
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
