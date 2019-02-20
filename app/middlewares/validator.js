const { check, validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  logger = require('../logger'),
  sessionManager = require('../services/sessionManager');

const userFields = ['firstName', 'lastName', 'password', 'email'];

const signInFields = ['password', 'email'];

const paginationFields = ['limit', 'offset'];

const validateErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    throw errors.badRequest(validationErrors.array());
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

const checkOptionalNumericField = fields =>
  check(fields)
    .optional()
    .isInt()
    .withMessage('must be a number');

const validateUserToken = (req, res, next) => {
  const userToken = req.headers[sessionManager.HEADER_NAME];
  if (!userToken) {
    logger.info(`The user is not logged in`);
    throw errors.userNotAuthorized(`The user is not logged in`);
  } else {
    next();
  }
};

exports.signUpValidator = [checkEmptyField(userFields), checkEmail, checkPassword, validateErrors];

exports.signInValidator = [checkEmptyField(signInFields), checkEmail, checkPassword, validateErrors];

exports.authValidator = [checkOptionalNumericField(paginationFields), validateUserToken, validateErrors];
