const User = require('../models/User');
const Product = require('../models/Product');

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

exports.decreaseQuantity = async (req, res, next) => {
  let bulkOps = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { quantity: -product.count, sold: +product.count } },
      },
    };
  });

  await Product.bulkWrite(bulkOps);

  next();
};
