const errors = require('../errors'),
  logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.BAD_REQUEST]: 400,
  [errors.DATABASE_ERROR]: 422,
  [errors.USER_ALREADY_EXISTS]: 422,
  [errors.USER_NOT_FOUND]: 404,
  [errors.INVALID_PASSWORD]: 422,
  [errors.USER_NOT_AUTHORIZED]: 400,
  [errors.USER_ALREADY_ADMIN]: 400,
  [errors.ALBUM_ALREADY_BOUGHT]: 400,
  [errors.ALBUM_NOT_FOUND]: 404,
  [errors.USER_WITHOUT_PERMISSIONS]: 403,
  [errors.INVALID_SESSION]: 403,
  [errors.DEFAULT_ERROR]: 500
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) {
    res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
