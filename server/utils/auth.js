const jwt = require('jsonwebtoken');
const { secret } = require('../utils/config');

function authCheck(req, res, next) {
  let token = req.query.token || req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: 'You have no token!' });
  }

  if (token.startsWith('Bearer ')) {
    // Remove 'Bearer ' from token
    token = token.slice(7, token.length);
  }

  try {
    // Verify token and get user data out of it
    const { data } = jwt.verify(token, secret);
    req.user = data;
    next(); // Call next middleware
  } catch {
    console.log('Invalid token');
    return res.status(400).json({ message: 'Invalid token!' });
  }
}

module.exports = authCheck;
