// routes/quiz.js
const express = require('express');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const router = express.Router();

// Create a new quiz
router.post('/create', async (req, res) => {
  try {
    const { categoryId, questions, totalMarks, timeLimit, startDate, endDate, classAssigned } = req.body;
    const newQuiz = new Quiz({
      categoryId,
      questions,
      totalMarks,
      timeLimit,
      startDate,
      endDate,
      classAssigned,
      isActive: false, // initially inactive
    });
    await newQuiz.save();
    res.status(200).json({ message: 'Quiz created successfully!', quiz: newQuiz });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Activate a quiz (admin only)
router.post('/activate/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (quiz) {
      quiz.isActive = true;
      await quiz.save();
      res.status(200).json({ message: 'Quiz activated successfully!' });
    } else {
      res.status(404).json({ message: 'Quiz not found!' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get quiz details by ID
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found or inactive!' });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Submit user answers for a quiz
router.post('/submit/:quizId', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found!' });

    let score = 0;
    const answerEntries = [];

    // Check each answer
    answers.forEach((answer) => {
      const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        score += isCorrect ? 1 : 0;
        answerEntries.push({ ...answer, isCorrect });
      }
    });

    // Save user answers and score
    const userAnswer = new Answer({
      quizId: quiz._id,
      userId,
      answers: answerEntries,
      score,
    });
    await userAnswer.save();

    res.status(200).json({ message: 'Quiz submitted successfully!', score });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
