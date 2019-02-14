const users = require('./controllers/users.js'),
  signUpValidator = require('./middlewares/validator').signUpValidator;

exports.init = app => app.post('/users', [signUpValidator], users.create);
