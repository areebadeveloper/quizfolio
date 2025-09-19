// controllers/questionController.js
const Question = require('../models/Question'); 
const Quiz = require('../models/Quiz');

const mongoose = require('mongoose');

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    
    const { text, category } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    
    
    const question = new Question(req.body);
    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: error.message });
  }
};


// Fetch questions by category
// exports.getQuestionsByCategory = async (req, res) => {
//   try {
//     const questions = await Question.find({ category: req.params.categoryId }).populate('category');
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching questions by category:', error);
//     res.status(500).json({ error: error.message });
//   }
// };



exports.getQuestionsByCategory = async (req, res) => {
  try {
    // Cast categoryId to ObjectId
    const categoryId = mongoose.Types.ObjectId(req.params.categoryId);

    const questions = await Question.find({ category: categoryId });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions by category:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getQuestionsByCategory = async (req, res) => {
    try {
      // Use 'new' to create an ObjectId instance
      const categoryId = new mongoose.Types.ObjectId(req.params.categoryId);
  
      const questions = await Question.find({ category: categoryId });
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions by category:', error);
      res.status(500).json({ error: error.message });
    }
  };


// Fetch all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
    try {
      // Trim the ID to remove extra spaces or newline characters
      const questionId = req.params.questionId.trim();
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return res.status(400).json({ msg: 'Invalid question ID format' });
      }
  
      const question = await Question.findById(questionId);
  
      // Check if question exists
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }
  
      // Delete the question
      await Question.findByIdAndDelete(questionId);
  
      res.json({ msg: 'Question deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  
  
  // Get a specific question by ID
  exports.getQuestionById = async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId);
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      console.error('Error fetching question by ID:', error);
      res.status(500).json({ error: error.message });
    }
  };

  // Fetch quizzes assigned to a specific class
exports.getAssignedQuizzes = async (req, res) => {
    try {
      const studentClass = req.user.class; // Assuming class is stored in user profile
      const quizzes = await Quiz.find({ classAssigned: studentClass }) // filter based on the student's class
        .populate('questions', 'text options'); // Populate questions with text and options
  
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching assigned quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch assigned quizzes' });
    }
  };