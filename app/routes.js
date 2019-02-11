const users = require('./controllers/users.js');

exports.init = app => {
  app.post('/users', [], users.create);
};
