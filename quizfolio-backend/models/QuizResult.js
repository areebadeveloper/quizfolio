// models/QuizResult.js

const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentClass: { type: String, required: true },
  email: { type: String, required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
});

QuizResultSchema.index({ studentId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', QuizResultSchema);
