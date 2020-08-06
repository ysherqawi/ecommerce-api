const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    name: String,
    price: Number,
    count: Number,
  },
  { timestamps: true }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = {
  cartItemSchema,
  CartItem,
};
