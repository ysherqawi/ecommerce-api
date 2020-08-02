const express = require('express');
const router = express.Router();

const {
  addCategory,
  getCategory,
  categoryById,
} = require('../controllers/categories');

const { protect, authorize } = require('../middleware/auth');

router.route('/').post(protect, authorize('admin'), addCategory);

router.route('/:id').get(getCategory);

router.param('id', categoryById);

module.exports = router;
