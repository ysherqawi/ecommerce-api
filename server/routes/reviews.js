const express = require('express');
const { getReviews, getReview, addReview } = require('../controllers/reviews');

const Review = require('../models/Review');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'product',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('admin', 'user'), addReview);

router.route('/:id').get(getReview);

module.exports = router;
