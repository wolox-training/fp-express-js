const errors = require('../errors');

const userFields = ['firstName', 'lastName', 'password', 'email'];

const isString = value => typeof value === 'string' || value instanceof String;

exports.handle = (req, res, next) => {
  userFields.forEach(field => {
    if (!req.body[field]) {
      next(errors.unprocessableEntity(`${field} can not be empty`));
    } else if (!isString(req.body[field])) {
      next(errors.unprocessableEntity(`${field} is not an string`));
    }
  });
  next();
};
