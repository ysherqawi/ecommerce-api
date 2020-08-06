const User = require('../models/User');

exports.addOrderToUserHistory = async (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((product) => {
    history.push({
      _id: product._id,
      name: product.name,
      quantity: product.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history } },
    { new: true }
  );
  next();
};
