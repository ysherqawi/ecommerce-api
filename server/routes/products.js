const express = require('express');
const router = express.Router();

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  productById,
} = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.param('id', productById);

module.exports = router;
