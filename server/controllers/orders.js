const { CartItem } = require('../models/CartItem');
const Order = require('../models/Order');

// @desc    orderById middleware
// run whenever an id param found in the route and populate the order in the req
exports.orderById = async (req, res, next, id) => {
  const order = await await Order.findById(id);

  if (!order)
    return next(new ErrorResponse(`No Order found with the id of ${id}`, 404));

  req.order = order;
  next();
};

// @desc    Create order
// @route   POST /api/v1/orders/create
// @access  Private
exports.createOrder = async (req, res, next) => {
  req.body.order.user = req.user;

  const order = new Order(req.body.order);

  await order.save();

  res.status(201).json({ success: true, data: order });
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
    .json({ success: true, data: Order.schema.path('status').enumValues });
};

// @desc    Get single order
// @route   GET /api/v1/orders/admin/:id
// @access  Private / Admin
exports.getOrder = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.order });
};

// @desc    Update order status
// @route   GET /api/v1/orders/admin/update
// @access  Private / Admin
exports.updateOrderStatus = async (req, res, next) => {
  const order = req.order;

  order.status = req.body.status;
  await order.save();

  res.status(200).json({ success: true, data: req.order });
};

// @desc    Get user purchase history
// @route   GET /api/v1/orders/history
// @access  Private
exports.getPurchaseHistory = async (req, res, next) => {
  const history = await Order.find({ user: req.user._id })
    .populate('user', '_id name')
    .sort('-created');

  res.status(200).json({ success: true, data: history });
};
