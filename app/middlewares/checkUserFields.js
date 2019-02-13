const { check } = require('express-validator/check');

const userFields = ['firstName', 'lastName', 'password', 'email'];

exports.handle = check(userFields)
  .exists()
  .withMessage('can not be empty');
