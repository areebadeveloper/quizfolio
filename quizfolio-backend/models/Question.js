// models/Question.js
const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  options: { type: [OptionSchema], required: true },
  correctAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: false },
});

module.exports = mongoose.model('Question', QuestionSchema);
