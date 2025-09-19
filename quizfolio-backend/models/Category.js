// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'] 
  }
});

module.exports = mongoose.model('Category', CategorySchema);
