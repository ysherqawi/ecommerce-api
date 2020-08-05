const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  const order = req.query.order || 'asc';
  const sortBy = req.query.sortBy || 'createdAt';
  const limit = parseInt(req.query.limit) || 5;
  const skip = parseInt(req.query.skip);

  const users = await User.find({
    _id: { $ne: req.user },
  })
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip);

  res.status(200).json({ success: true, count: users.length, data: users });

  res.status(200).json();
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(`There is no user with the id ${req.params.id}`)
    );

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user)
    return next(
      new ErrorResponse(`There is no user with the id ${req.params.id}`)
    );

  // Enable this if admin wants to update user password
  // if (req.body.password) {
  //   user.password = req.body.password;
  //   await user.save();
  // }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc    Delete user
// @route   Delete /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(`There is no user with the id ${req.params.id}`)
    );

  res.status(200).json({
    success: true,
    data: {},
  });
};
