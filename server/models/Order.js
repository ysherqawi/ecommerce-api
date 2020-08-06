const mongoose = require('mongoose');
const { cartItemSchema } = require('./CartItem');

const OrderSchema = new mongoose.Schema(
  {
    products: [cartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: 'Not processed',
      enum: [
        'Not processed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
      ], // enum means string objects
    },
    updated: Date,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
