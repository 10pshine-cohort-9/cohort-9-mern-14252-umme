const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { User } = require('../models');

/**
 * Verifies the Bearer JWT on the Authorization header and attaches
 * the authenticated user to req.user. Notes and other resources are
 * always scoped to this user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Authentication token missing');
  }

  const token = header.split(' ')[1];

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  if (!mongoose.isValidObjectId(payload.id)) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }

  req.user = user;
  next();
});

module.exports = { authenticate };
