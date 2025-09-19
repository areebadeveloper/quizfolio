const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResultController');
const auth = require('../middleware/auth');  // Middleware to verify JWT
const QuizResult = require('../models/QuizResult');


// Route to store quiz result data
router.post('/submit', auth, quizResultController.storeQuizResult);


// Route to check if the student has already attempted the quiz
router.get('/check-attempt/:quizId', auth, async (req, res) => {
    try {
      const { quizId } = req.params;
      const { email } = req.user;
  
      const existingResult = await QuizResult.findOne({ quizId, email });
  
      if (existingResult) {
        return res.status(400).json({ msg: 'You have already attempted this quiz.' });
      }
  
      res.json({ msg: 'Quiz attempt is allowed.' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });



  // Route to check if a student has already attempted a quiz
router.get('/check/:quizId/:studentId', async (req, res) => {
    const { quizId, studentId } = req.params;
  
    try {
      // Check if a result already exists for the quiz and student
      const existingResult = await QuizResult.findOne({ quizId, studentId });
  
      if (existingResult) {
        return res.json({ attempted: true });
      }
      res.json({ attempted: false });
    } catch (error) {
      console.error('Error checking quiz result:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  // Route to store quiz result data
router.post('/submit', auth, quizResultController.storeQuizResult);

// Route to check if a student has already attempted a quiz by email and quizId
router.get('/check-attempt/:quizId', auth, quizResultController.checkQuizAttemptByEmail);

// Route to check if a student has already attempted a quiz by studentId and quizId
router.get('/check/:quizId/:studentId', quizResultController.checkQuizAttemptByStudentId);

// Route to get all quiz results
router.get('/all', auth, quizResultController.getAllQuizResults);

  
module.exports = router;
