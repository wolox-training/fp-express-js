const users = require('./controllers/users.js'),
  emailValidator = require('./middlewares/emailValidator').handle,
  passwordValidator = require('./middlewares/passwordValidator').handle,
  userFieldsValidator = require('./middlewares/userFieldsValidator').handle;

exports.init = app => {
  app.post('/users', [userFieldsValidator, emailValidator, passwordValidator], users.create);
};
