const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create category
// @route   POST /api/v1/auth/category
// @access  Public
exports.addCategory = async (req, res, next) => {
  const category = await Category.create(req.body);
  await category.save();

  res.status(201).json({ success: true, data: category });
};
