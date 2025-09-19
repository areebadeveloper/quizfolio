//controllers/quizController.js
const Quiz = require('../models/Quiz');
const Answer = require('../models/Answer');

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuizzes = async (req, res) => {
    try {
      // Populate both categoryId and questions
      const quizzes = await Quiz.find()
        .populate('categoryId', 'name') // Populate only the name field of the category
        .populate('questions', 'text'); // Populate only the text field of questions
  
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes', error);
      res.status(500).json({ error: error.message });
    }
  };


// Delete a quiz by ID
exports.deleteQuiz = async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
      
      await Quiz.findByIdAndDelete(req.params.quizId);
      res.json({ msg: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a quiz by ID
  exports.updateQuiz = async (req, res) => {
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
      if (!updatedQuiz) return res.status(404).json({ msg: 'Quiz not found' });
  
      res.json(updatedQuiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ error: error.message });
    }
  };


// Placeholder for scheduling a quiz
exports.scheduleQuiz = (req, res) => {
    res.status(200).json({ message: "Quiz scheduled successfully" });
  };
  
  // Placeholder for starting a quiz attempt
  exports.startQuizAttempt = (req, res) => {
    res.status(200).json({ message: "Quiz attempt started successfully" });
  };
  
  // Placeholder for ending a quiz attempt
  exports.endQuizAttempt = (req, res) => {
    res.status(200).json({ message: "Quiz attempt ended successfully" });
  };
  
  // Get quiz by ID (optional helper for front-end editing)
  exports.getQuizById = async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.quizId).populate('categoryId').populate('questions');
      if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
  
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: error.message });
    }
  };





// Fetch an active quiz from a specific category
exports.getQuizByCategory = async (req, res) => {
    try {
        // Ensure the user is a student
        if (req.user.userType !== 'student') {
            return res.status(403).json({ message: 'Only students can attempt quizzes' });
        }

        const { categoryId } = req.params;

        // Find an active quiz in the specified category
        const quiz = await Quiz.findOne({ categoryId: categoryId, isActive: true })
            .populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: 'No active quiz found for this category' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// Submit quiz attempt and calculate score
exports.attemptQuiz = async (req, res) => {
    try {
        if (req.user.userType !== 'student') {
            return res.status(403).json({ message: 'Only students can attempt quizzes' });
        }

        const { quizId } = req.params;
        const { answers } = req.body;

        // Find the quiz and ensure it's active
        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz || !quiz.isActive) {
            return res.status(404).json({ message: 'Quiz not found or inactive' });
        }

        let score = 0;
        const answerEntries = answers.map(answer => {
            const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
            const isCorrect = question && question.options.find(opt => opt._id.toString() === answer.selectedAnswer)?.isCorrect;
            if (isCorrect) score += 1;
            return { questionId: answer.questionId, selectedAnswer: answer.selectedAnswer, isCorrect };
        });

        // Save the attempt to Answer model
        const quizAttempt = new Answer({
            quizId: quiz._id,
            userId: req.user.id,
            answers: answerEntries,
            score,
        });

        await quizAttempt.save();

        res.status(200).json({ message: 'Quiz attempt recorded successfully', score });
    } catch (error) {
        console.error('Error during quiz attempt:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



// exports.submitQuiz = async (req, res) => {
//     try {
//       const { quizId } = req.params;
//       const { answers, score } = req.body;
      
//       const studentResult = new Answer({
//         quizId,
//         userId: req.user.id,
//         answers,
//         score,
//       });
  
//       await studentResult.save();
//       res.json({ score });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };


// Define the startQuizAttempt function
exports.startQuizAttempt = async (req, res) => {
  try {
    // Sample response, you can implement your own logic
    res.status(200).json({ message: 'Quiz attempt started successfully!' });
  } catch (error) {
    console.error('Error starting quiz attempt:', error);
    res.status(500).json({ error: 'Error starting quiz attempt' });
  }
};

// Define the submitQuiz function
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    // Implement your logic to calculate score and store result
    res.status(200).json({ message: 'Quiz submitted successfully!', score: 80 }); // Example score
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Error submitting quiz' });
  }
};


  exports.activateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await Quiz.findById(quizId);
  
      // If quiz is not found, return a 404 error
      if (!quiz) {
        console.error('Quiz not found:', quizId); // Log the missing quiz ID
        return res.status(404).json({ message: `Quiz with ID ${quizId} not found` });
      }
  
      // Toggle the isActive status and save the quiz
      quiz.isActive = !quiz.isActive;
      await quiz.save();
  
      console.log(`Quiz ${quizId} status updated to`, quiz.isActive ? 'Active' : 'Inactive'); // Log status change
      res.json({ message: 'Quiz status updated successfully', isActive: quiz.isActive });
    } catch (error) {
      // Log the error details on the server
      console.error('Error activating quiz:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  