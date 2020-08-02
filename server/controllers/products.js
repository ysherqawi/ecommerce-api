const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private / admin
exports.addProduct = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return next(new ErrorResponse('Image could not be uploaded', 400));

    let product = new Product(fields);

    if (files.photo) {
      if (!files.photo.type.startsWith('image'))
        return next(new ErrorResponse('Please upload Image file', 400));

      if (files.photo.size > 1000000)
        return next(
          new ErrorResponse('Image size should not be greater than 1MB', 400)
        );

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) return next(err);
      res.status(201).json({ success: true, data: result });
    });
  });
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Private / admin
exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(
      new ErrorResponse(`No Product found with the id of ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: product });
};
