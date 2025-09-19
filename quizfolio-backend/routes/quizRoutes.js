const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();
const Question = require('../models/Question'); // Import the Question model
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz'); // Import the Question model

// Schedule a new quiz
router.post('/schedule', quizController.scheduleQuiz);

// Route to fetch an active quiz from a specific category for a student
router.get('/category/:categoryId', auth, quizController.getQuizByCategory);

// Route to submit quiz attempt
router.post('/attempt/:quizId', auth, quizController.attemptQuiz);


//router.get('/quiz/category/:categoryId', auth, quizController.getQuizByCategory);
//router.post('/quiz/attempt/:quizId', auth, quizController.submitQuizAttempt);


// Start a quiz attempt
// Define fixed paths first to avoid conflicts with parameterized paths
router.post('/start', quizController.startQuizAttempt);
router.post('/quizzes/:quizId/submit', auth, quizController.submitQuiz);

// Fetch quiz by category with explicit ObjectId validation
router.get('/category/:categoryId', async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    await quizController.fetchQuizByCategory(req, res);
  } catch (error) {
    next(error);
  }
});



router.put('/quizzes/:quizId/activate', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Toggle the `isActive` status
    quiz.isActive = !quiz.isActive;

    // Save only the `isActive` field without validating other fields
    await quiz.save({ validateBeforeSave: false });

    res.json({ message: `Quiz ${quiz.isActive ? 'activated' : 'deactivated'} successfully`, isActive: quiz.isActive });
  } catch (error) {
    console.error('Error toggling quiz activation status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all questions for the quiz
router.get('/questions', async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/questions', async (req, res) => {
    try {
      const questions = await Question.find();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error); // Log the error
      res.status(500).json({ message: error.message });
    }
  });
  
  
// End a quiz attempt
router.post('/end/:attemptId', quizController.endQuizAttempt);

// Route to activate a quiz
router.put('/quizzes/:quizId/activate', quizController.activateQuiz);


// Define routes
router.post('/start', quizController.startQuizAttempt);
router.post('/quizzes/:quizId/submit', auth, quizController.submitQuiz);


module.exports = router;
