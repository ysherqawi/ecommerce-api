const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

// @desc    categoryById middleware
// run whenever an id param found in the route and populate the category in the req
exports.categoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);

  if (!category)
    return next(
      new ErrorResponse(`No Category found with the id of ${id}`, 404)
    );

  req.category = category;
  next();
};

// @desc    Get all categries
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, data: categories });
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private / admin
exports.addCategory = async (req, res, next) => {
  const category = await Category.create(req.body);
  await category.save();

  res.status(201).json({ success: true, data: category });
};

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.category });
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private / admin
exports.updateCategory = async (req, res, next) => {
  const category = req.category;
  await category.update(req.body, { runValidators: true, new: true });

  res.status(200).json({ success: true, data: category });
};
// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private / admin
exports.deleteCategory = async (req, res, next) => {
  await req.category.remove();
  res.status(200).json({ success: true, data: {} });
};
