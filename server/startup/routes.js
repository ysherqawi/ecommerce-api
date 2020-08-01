const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function (app) {
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/users', users);
};
