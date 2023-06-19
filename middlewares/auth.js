const jwt = require('jsonwebtoken');
const { ERROR_CODE } = require('../constsns/constans');
const secretKey = require('../constsns/secret-key');

// todo: use it
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODE.UNAUTHORIZED).json({ message: 'Missing authorization token' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(ERROR_CODE.UNAUTHORIZED).json({ message: 'Invalid authorization token' });
  }
};
