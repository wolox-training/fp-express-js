const users = require('./controllers/users.js'),
  signUpValidator = require('./middlewares/validator').signUpValidator,
  signInValidator = require('./middlewares/validator').signInValidator,
  authValidator = require('./middlewares/validator').authValidator;

exports.init = app => {
  app.post('/users', [signUpValidator], users.create),
    app.post('/users/sessions', [signInValidator], users.signIn),
    app.get('/users', [authValidator], users.getUsers),
    app.post('/admin/users', [authValidator, signUpValidator], users.createAdmin);
};
