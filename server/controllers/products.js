const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    productById middleware
// run whenever an id param found in the route and populate the product in the req
exports.productById = async (req, res, next, id) => {
  const product = await Product.findById(id);

  if (!product)
    return next(
      new ErrorResponse(`No Product found with the id of ${id}`, 404)
    );

  req.product = product;
  next();
};

// @desc    Get all product
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  const order = req.query.order || 'asc';
  const sortBy = req.query.sortBy || '_id';
  const limit = parseInt(req.query.limit) || 6;
  const skip = parseInt(req.query.skip) || 0;

  const products = await Product.find()
    //.select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip);

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
};

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
// @access  Public
exports.getProduct = async (req, res, next) => {
  res.status(200).json({ success: true, data: req.product });
};

// @desc    Update  product
// @route   PUT /api/v1/products/:id
// @access  Private / admin
exports.updateProduct = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return next(new ErrorResponse('Image could not be uploaded', 400));

    let product = req.product;
    product = _.extend(product, fields);

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
      res.status(200).json({ success: true, data: result });
    });
  });
};

// @desc    Delete  product
// @route   DELETE /api/v1/products/:id
// @access  Private / admin
exports.deleteProduct = async (req, res, next) => {
  await req.product.remove();

  res.status(200).json({ success: true, data: {} });
};

// @desc    Get related products
// @route   GET /api/v1/products/related/:id
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;
  const products = await Product.find({
    _id: { $ne: req.product },
    category: req.product.category,
  })
    .populate('category', '_id name')
    .limit(limit);
  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
};
