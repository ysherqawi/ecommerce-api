const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      maxlength: [50, 'Name should not be more than 25 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Name should not be more than 1000 characters'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [1, 'price should be greater than 0'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Please add a category'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add a quantity value'],
      min: [1, 'quantity should be greater than 0'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
      required: [true, 'Please add a shipping option'],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const product = this;
  const userObject = product.toObject();

  delete userObject.photo;

  return userObject;
};

module.exports = mongoose.model('Product', productSchema);
