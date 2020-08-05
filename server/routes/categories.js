const express = require('express');
const router = express.Router();

const Category = require('../models/Category');

const {
  getCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  categoryById,
} = require('../controllers/categories');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(protect, authorize('admin'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router.param('id', categoryById);

module.exports = router;
