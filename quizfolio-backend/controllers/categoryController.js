// controllers/categoryController.js

const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a category
  exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.categoryId);
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a category
  exports.updateCategory = async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };