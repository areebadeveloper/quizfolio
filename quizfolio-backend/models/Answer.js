// models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedAnswer: { type: String, required: true }, // answer chosen by user
      isCorrect: { type: Boolean, required: true }, // whether the answer is correct
    },
  ],
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('Answer', answerSchema);
