const users = require('./controllers/users.js'),
  signUpValidator = require('./middlewares/signUpValidator').handle;

exports.init = app => app.post('/users', [signUpValidator], users.create);
