// routes/api.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const questionController = require('../controllers/questionController');
const quizController = require('../controllers/quizController');
const classController = require('../controllers/classController');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const emailRoutes = require('./email');


// Category Routes
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.delete('/categories/:categoryId', categoryController.deleteCategory);
router.put('/categories/:categoryId', categoryController.updateCategory);

// Question Routes
router.post('/questions', questionController.createQuestion);
router.get('/questions', questionController.getQuestions);
router.get('/questions/category/:categoryId', questionController.getQuestionsByCategory);
router.get('/questions/:questionId', questionController.getQuestionById);
router.delete('/questions/:questionId', questionController.deleteQuestion);

// Quiz Routes
router.post('/quizzes', quizController.createQuiz);
router.get('/quizzes', quizController.getQuizzes);
router.get('/quizzes/:quizId', quizController.getQuizById);
router.put('/quizzes/:quizId', quizController.updateQuiz);
router.delete('/quizzes/:quizId', quizController.deleteQuiz);

// Class Routes
router.post('/classes', classController.createClass);
router.get('/classes', classController.getClasses);
router.get('/classes/:classId/quizzes', classController.getClassQuizzes);
//router.post('/classes/assign-quizzes', classController.assignQuizzesToClass); 
router.post('/classes/assign-quizzes', classController.assignQuizzesToClass);
router.get('/classes/:classId/quizzes', classController.getClassQuizzes);
router.get('/classes/:classId/quizzes', classController.getClassQuizzes);
router.get('/classes-with-quizzes', classController.getClassesWithQuizzes);
router.post('/classes/assign-quizzes', classController.assignQuizzesToClass);

// User and Auth Routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.use('/api/email', emailRoutes);

module.exports = router;
