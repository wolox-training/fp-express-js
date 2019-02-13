const { validationResult } = require('express-validator/check'),
  checkUserFields = require('../middlewares/checkUserFields').handle,
  checkEmail = require('../middlewares/checkEmail').handle,
  checkPassword = require('../middlewares/checkPassword').handle,
  errors = require('../errors');

const validateErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationResult(req).isEmpty()) {
    throw errors.databaseError(validationErrors.array());
  }
  next();
};

exports.handle = [checkUserFields, checkEmail, checkPassword, validateErrors];
