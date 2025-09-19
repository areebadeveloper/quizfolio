// controllers/classController.js

const Class = require('../models/Class');
const Quiz = require('../models/Quiz');

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ error: 'Error creating class' });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching classes' });
  }
};

exports.getClassQuizzes = async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findById(classId).populate('quizzes');
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData.quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching quizzes for class' });
  }
};

exports.assignQuizzesToClass = async (req, res) => {
    try {
      const { classId, quizIds } = req.body;
  
      // Update the class with the quizzes using $addToSet to avoid duplicate entries
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $addToSet: { quizzes: { $each: quizIds } } },
        { new: true }
      ).populate('quizzes'); // Optionally populate quizzes for immediate feedback
  
      if (!updatedClass) {
        return res.status(404).json({ error: 'Class not found' });
      }
  
      res.status(200).json({ message: 'Quizzes assigned successfully', class: updatedClass });
    } catch (error) {
      res.status(500).json({ error: 'Error assigning quizzes to class' });
    }
  };



exports.getClassQuizzes = async (req, res) => {
    try {
      const { classId } = req.params;
      const classData = await Class.findById(classId).populate('quizzes');
      if (!classData) {
        return res.status(404).json({ error: 'Class not found' });
      }
      res.json(classData.quizzes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quizzes for class' });
    }
  };


  // controllers/classController.js



exports.getClassesWithQuizzes = async (req, res) => {
  try {
    const classes = await Class.find().populate('quizzes'); // Populate quizzes for each class
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching classes and their quizzes' });
  }
};
