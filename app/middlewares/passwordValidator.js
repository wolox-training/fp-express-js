const errors = require('../errors');

const isAlphanumeric = string => string.match(/^[a-zA-Z0-9]+$/);

const isValidPassword = password => password.length >= 8 && password.length <= 24 && isAlphanumeric(password);

exports.handle = (req, res, next) => {
  if (!isValidPassword(req.body.password)) {
    next(errors.defaultError('Invalid password'));
  }
  next();
};
