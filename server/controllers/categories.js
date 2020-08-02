const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

// @desc    categoryById middleware
// run whenever an id param found in the route and populate the category in the req
exports.categoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);

  if (!category)
    return next(
      new ErrorResponse(
        `No Category found with the id of ${req.params.id}`,
        404
      )
    );
  req.category = category;

  next();
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private / admin
exports.addCategory = async (req, res, next) => {
  const category = await Category.create(req.body);
  await category.save();

  res.status(201).json({ success: true, data: category });
};
