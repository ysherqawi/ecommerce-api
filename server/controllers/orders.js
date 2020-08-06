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

// @desc    Get orders
// @route   GET /api/v1/orders/admin/list
// @access  Private / Admin
exports.getOrders = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get status values
// @route   GET /api/v1/orders/admin/status-values
// @access  Private / Admin
exports.getStatusValues = async (req, res, next) => {
  res
    .status(200)
    .json({ succes: true, status: Order.schema.path('status').enumValues });
};
