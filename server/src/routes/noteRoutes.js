const express = require('express');
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate); // every note route requires a logged-in user

router.get('/', noteController.listNotes);
router.get('/:id', noteController.getNote);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 })],
  validate,
  noteController.createNote
);

router.put(
  '/:id',
  [body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')],
  validate,
  noteController.updateNote
);

router.delete('/:id', noteController.deleteNote);

module.exports = router;
