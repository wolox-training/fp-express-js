exports.BAD_REQUEST = 'BAD_REQUEST';

exports.DATABASE_ERROR = 'DATABASE_ERROR';

exports.USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';

exports.USER_NOT_FOUND = 'USER_NOT_FOUND';

exports.INVALID_PASSWORD = 'INVALID_PASSWORD';

exports.USER_NOT_AUTHORIZED = 'USER_NOT_AUTHORIZED';

exports.USER_ALREADY_ADMIN = 'USER_ALREADY_ADMIN';

exports.ALBUM_ALREADY_BOUGHT = 'ALBUM_ALREADY_BOUGHT';

exports.ALBUM_NOT_FOUND = 'ALBUM_NOT_FOUND';

exports.USER_WITHOUT_PERMISSIONS = 'USER_WITHOUT_PERMISSIONS';

exports.DEFAULT_ERROR = 'DEFAULT_ERROR';

const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.badRequest = message => internalError(message, exports.BAD_REQUEST);
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);
exports.userAlreadyExists = message => internalError(message, exports.USER_ALREADY_EXISTS);
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
exports.userNotFound = message => internalError(message, exports.USER_NOT_FOUND);
exports.invalidPassword = message => internalError(message, exports.INVALID_PASSWORD);
exports.userNotAuthorized = message => internalError(message, exports.USER_NOT_AUTHORIZED);
exports.userAlreadyAdmin = message => internalError(message, exports.USER_ALREADY_ADMIN);
exports.albumAlreadyBought = message => internalError(message, exports.ALBUM_ALREADY_BOUGHT);
exports.albumNotFound = message => internalError(message, exports.ALBUM_NOT_FOUND);
exports.userWithoutPermissions = message => internalError(message, exports.USER_WITHOUT_PERMISSIONS);
exports.internalServerError = message => internalError(message, exports.INTERNAL_SERVER_ERROR);
