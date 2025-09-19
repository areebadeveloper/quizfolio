const QuizResult = require('../models/QuizResult');

// Controller to store a quiz result
exports.storeQuizResult = async (req, res) => {
  const { studentId, studentName, studentClass, email, quizId, score, timeSpent } = req.body;

  try {
    // Create a new quiz result document
    const newResult = new QuizResult({
      studentId,
      studentName,
      studentClass,
      email,
      quizId,
      score,
      timeSpent,
    });

    // Save the result to the database
    await newResult.save();

    res.status(201).json({ message: 'Quiz result stored successfully!' });
  } catch (error) {
    console.error('Error storing quiz result:', error);
    res.status(500).json({ error: 'Failed to store quiz result.' });
  }
};

// Controller to check quiz attempt by email
exports.checkQuizAttemptByEmail = async (req, res) => {
  const { quizId } = req.params;
  const { email } = req.user;  // Email from JWT token

  try {
    const existingResult = await QuizResult.findOne({ quizId, email });

    if (existingResult) {
      return res.status(400).json({ msg: 'You have already attempted this quiz.' });
    }

    res.json({ msg: 'Quiz attempt is allowed.' });
  } catch (error) {
    console.error('Error checking quiz attempt:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to check quiz attempt by studentId
exports.checkQuizAttemptByStudentId = async (req, res) => {
  const { quizId, studentId } = req.params;

  try {
    const existingResult = await QuizResult.findOne({ quizId, studentId });

    if (existingResult) {
      return res.json({ attempted: true });
    }

    res.json({ attempted: false });
  } catch (error) {
    console.error('Error checking quiz result:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to retrieve all quiz results
exports.getAllQuizResults = async (req, res) => {
  try {
    const allResults = await QuizResult.find().populate('quizId', 'title'); // Populate quiz title for reference
    res.json(allResults);
  } catch (error) {
    console.error('Error retrieving all quiz results:', error);
    res.status(500).json({ error: 'Failed to retrieve quiz results.' });
  }
};
