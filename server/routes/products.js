const express = require('express');
const router = express.Router();

const { addProduct } = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');
router.route('/').post(protect, authorize('admin'), addProduct);

module.exports = router;
