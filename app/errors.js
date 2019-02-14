exports.BAD_REQUEST = 'BAD_REQUEST';

exports.DATABASE_ERROR = 'DATABASE_ERROR';

exports.USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';

exports.DEFAULT_ERROR = 'DEFAULT_ERROR';

const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.badRequest = message => internalError(message, exports.BAD_REQUEST);
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);
exports.userAlreadyExists = message => internalError(message, exports.USER_ALREADY_EXISTS);
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
