// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  totalMarks: { type: Number, required: true },
  timeLimit: { type: Number, required: true }, // time limit in minutes
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false }, // whether quiz is active or not
  classAssigned: { type: String, required: true }, // class to which quiz is assigned
});

module.exports = mongoose.model('Quiz', quizSchema);
