const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');
const Review = require('../models/Review');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({ product: req.params.productId });

    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else res.status(200).json(res.advancedResults);
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'product',
    select: 'name description',
  });

  if (!review)
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: review });
};
