const { check, validationResult } = require('express-validator/check');

const users = require('./controllers/users.js'),
  userFieldsValidator = require('./middlewares/userFieldsValidator').handle,
  errors = require('./errors');

exports.init = app => {
  app.post(
    '/users',
    [
      userFieldsValidator,
      check('email')
        .isEmail()
        .withMessage('must be an email')
        .matches(/[A-Z0-9._%+-]*@wolox.com.ar/)
        .withMessage('must be @wolox.com.ar'),
      check('password')
        .isLength({ min: 8 })
        .withMessage('must be at least 8 chars long')
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage('must have only letters and numbers')
    ],
    (req, res, next) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        throw errors.unprocessableEntity(validationErrors.array());
      }
      return users.create(req, res, next);
    }
  );
};
