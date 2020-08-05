const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  productById,
  getRelatedProducts,
  getProductsCategories,
  getProductPhoto,
} = require('../controllers/products');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Product, 'category'), getProducts)
  .post(protect, authorize('admin'), addProduct);

router.route('/categories').get(getProductsCategories);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/photo/:id').get(getProductPhoto);

router.route('/related/:id').get(getRelatedProducts);

router.param('id', productById);

module.exports = router;
