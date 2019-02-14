const { check, validationResult } = require('express-validator/check'),
  errors = require('../errors');

const userFields = ['firstName', 'lastName', 'password', 'email'];

const validateErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    throw errors.databaseError(validationErrors.array());
  }
  next();
};

const checkEmptyField = fields =>
  check(fields)
    .exists()
    .withMessage('can not be empty');

const checkEmail = check('email')
  .isEmail()
  .withMessage('must be an email')
  .matches(/[A-Z0-9._%+-]*@wolox.com.ar/)
  .withMessage('must be @wolox.com.ar');

const checkPassword = check('password')
  .isLength({ min: 8 })
  .withMessage('must be at least 8 chars long')
  .matches(/^[a-zA-Z0-9]+$/)
  .withMessage('must have only letters and numbers');

exports.signUpValidator = [checkEmptyField(userFields), checkEmail, checkPassword, validateErrors];
