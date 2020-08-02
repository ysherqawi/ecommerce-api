const express = require('express');
const router = express.Router();

const {
  getCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  categoryById,
} = require('../controllers/categories');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), addCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router.param('id', categoryById);

module.exports = router;
