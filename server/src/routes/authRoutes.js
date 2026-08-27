const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .custom((password) => {
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new Error('Password must be at most 72 bytes');
    }
    return true;
  }),
  ],
  validate,
  authController.signup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password')
  .notEmpty()
  .withMessage('Password is required')
  .custom((password) => {
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new Error('Password must be at most 72 bytes');
    }
    return true;
  }),
  ],
  validate,
  authController.login
);

router.get('/me', authenticate, authController.me);

module.exports = router;
