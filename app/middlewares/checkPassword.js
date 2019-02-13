const { check } = require('express-validator/check');

exports.handle = check('password')
  .isLength({ min: 8 })
  .withMessage('must be at least 8 chars long')
  .matches(/^[a-zA-Z0-9]+$/)
  .withMessage('must have only letters and numbers');
