const { CartItem } = require('../models/CartItem');
const Order = require('../models/Order');

// @desc    Create order
// @route   POST /api/v1/orders/create
// @access  Private
exports.createOrder = async (req, res, next) => {
  req.body.order.user = req.user;

  const order = new Order(req.body.order);

  await order.save();

  res.status(201).json({ success: true, order });
};
