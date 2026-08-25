const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const logger = require('../config/logger');

const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  logger.info({ userId: user.id }, 'New user registered');
  res.status(201).json({ success: true, data: { user, token } });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  logger.info({ userId: user.id }, 'User logged in');
  res.status(200).json({ success: true, data: { user, token } });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeJSON() } });
});

module.exports = { signup, login, me };
