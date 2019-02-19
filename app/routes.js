const users = require('./controllers/users.js'),
  signUpValidator = require('./middlewares/validator').signUpValidator,
  signInValidator = require('./middlewares/validator').signInValidator;

exports.init = app => {
  app.post('/users', [signUpValidator], users.create),
    app.post('/users/sessions', [signInValidator], users.signIn);
};
