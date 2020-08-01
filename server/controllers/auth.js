const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const user = await User.create(req.body);

  await user.save();

  sendResponseToken(user, res, 201);
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email & password
  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));

  //Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

  sendResponseToken(user, res, 200);
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Log user out /clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
  });
};

//Get token from model, create cookie and send response
const sendResponseToken = (user, res, statusCode) => {
  const token = user.generateAuthToken();
  const options = {
    //Expires after 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
