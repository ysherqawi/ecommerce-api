const express = require('express');
const router = express.Router();

const { addProduct, getProduct } = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');
router.route('/').post(protect, authorize('admin'), addProduct);
router.route('/:id').get(protect, authorize('admin'), getProduct);

module.exports = router;
