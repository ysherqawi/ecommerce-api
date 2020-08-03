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
  // const skip = parseInt(req.query.skip) || 0;

  const products = await Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit);
  // .skip(skip);

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

// @desc    Get products categories
// @route   GET /api/v1/products/categories
// @access  Public
exports.getProductsCategories = async (req, res, next) => {
  const categories = await Product.distinct('category');
  res.status(200).json({ success: true, data: categories });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

// @desc    Get products by search
// @route   POST /api/v1/products/by/search
// @access  Public
exports.getProductsBySearch = async (req, res, next) => {
  const order = req.body.order || 'desc';
  const sortBy = req.body.sortBy || '_id';
  const limit = parseInt(req.body.limit) || 100;
  const skip = parseInt(req.body.skip);
  const findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price')
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      else findArgs[key] = req.body.filters[key];
    }
  }

  const products = await Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
};

// @desc    Get products photo
// @route   GET /api/v1/products/:id/photo
// @access  Public
exports.getProductPhoto = async (req, res, next) => {
  if (!req.product.photo.data) {
    return next(new ErrorResponse('Image could not be found', 404));
  }
  res.set('Content-Type', req.product.photo.data.contentType);
  res.send(req.product.photo.data);
  next();
};
