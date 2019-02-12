exports.defaultError = message => ({
  message,
  internalCode: 500
});

exports.unprocessableEntity = message => ({
  message,
  internalCode: 422
});

exports.badRequest = message => ({
  message,
  internalCode: 400
});
