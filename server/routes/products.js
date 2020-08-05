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
  getProductsByFilter,
  getProductPhoto,
  searchProducts,
} = require('../controllers/products');

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), addProduct);

router.route('/categories').get(getProductsCategories);

router.route('/by/filter').post(getProductsByFilter);

router.route('/searchproducts').get(searchProducts);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/photo/:id').get(getProductPhoto);

router.route('/related/:id').get(getRelatedProducts);

router.param('id', productById);

module.exports = router;
