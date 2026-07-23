const express = require('express');
const { body } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createMessage } = require('../controllers/messageController');

const router = express.Router();

// POST /api/messages — Submit contact message
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters.'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .isLength({ max: 255 })
      .normalizeEmail(),
    body('message')
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage('Message must be between 10 and 5000 characters.'),
  ],
  validateMiddleware,
  createMessage
);

module.exports = router;
