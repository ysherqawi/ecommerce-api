const express = require('express');
const router = express.Router();

const { addCategory } = require('../controllers/categories');

const { protect, authorize } = require('../middleware/auth');
router.route('/').post(protect, authorize('admin'), addCategory);

module.exports = router;
