const checkUserFields = require('../middlewares/checkUserFields').handle,
  checkEmail = require('../middlewares/checkEmail').handle,
  checkPassword = require('../middlewares/checkPassword').handle;

exports.handle = [checkUserFields, checkEmail, checkPassword];
