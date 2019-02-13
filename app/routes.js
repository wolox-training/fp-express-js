const { check, validationResult } = require('express-validator/check');

const users = require('./controllers/users.js'),
  signUpValidator = require('./middlewares/signUpValidator').handle,
  errors = require('./errors');

exports.init = app => {
  app.post('/users', [signUpValidator], (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw errors.databaseError(validationErrors.array());
    }
    return users.create(req, res, next);
  });
};
