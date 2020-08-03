const express = require('express');
const router = express.Router();

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  productById,
  getRelatedProducts,
  getProductsCategories,
  getProductsBySearch,
} = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), addProduct);

router.route('/categories').get(getProductsCategories);

router.route('/by/search').post(getProductsBySearch);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/related/:id').get(getRelatedProducts);

router.param('id', productById);

module.exports = router;
