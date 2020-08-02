const auth = require('../routes/auth');
const users = require('../routes/users');
const categories = require('../routes/categories');
const products = require('../routes/products');
const errorHandler = require('../middleware/error');

module.exports = function (app) {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users', users);
  app.use('/api/v1/categories', categories);
  app.use('/api/v1/products', products);
  app.use(errorHandler);
};
