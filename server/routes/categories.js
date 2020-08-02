const express = require('express');
const router = express.Router();

const { addCategory, categoryById } = require('../controllers/categories');

const { protect, authorize } = require('../middleware/auth');
router.route('/').post(protect, authorize('admin'), addCategory);

router.param('id', categoryById);

module.exports = router;
