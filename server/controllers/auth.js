const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  const user = await User.create(req.body);

  await user.save();

  res.status(201).json({ sucess: true, user });
};
