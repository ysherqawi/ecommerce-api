const auth = require('../routes/auth');
const users = require('../routes/users');
const categories = require('../routes/categories');
const products = require('../routes/products');
const braintree = require('../routes/braintree');
const orders = require('../routes/orders');
const errorHandler = require('../middleware/error');

module.exports = function (app) {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users', users);
  app.use('/api/v1/categories', categories);
  app.use('/api/v1/products', products);
  app.use('/api/v1/braintree', braintree);
  app.use('/api/v1/orders', orders);
  app.use(errorHandler);
};
