const { check } = require('express-validator/check');

exports.handle = check('email')
  .isEmail()
  .withMessage('must be an email')
  .matches(/[A-Z0-9._%+-]*@wolox.com.ar/)
  .withMessage('must be @wolox.com.ar');
