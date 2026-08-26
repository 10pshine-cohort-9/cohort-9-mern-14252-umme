const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const generateToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const signup = async ({ name, email, password }) => {
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    return { user: user.toSafeJSON(), token };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal('Unable to create account');
  }
};

const login = async ({ email, password }) => {
  try {
    // password has `select: false` on the schema, so opt in explicitly here
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user);

    return { user: user.toSafeJSON(), token };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal('Unable to login');
  }
};

module.exports = { signup, login, generateToken };