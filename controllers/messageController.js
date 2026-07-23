const { pool } = require('../database/db');
const { sendContactEmail } = require('../utils/sendEmail');
const catchAsyncError = require('../utils/catchAsyncError');

/**
 * POST /api/messages — Save a contact form message and trigger email notification.
 */
const createMessage = catchAsyncError(async (req, res) => {
  const { name, email, message } = req.body;

  const result = await pool.query(
    'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [name.trim(), email.trim().toLowerCase(), message.trim()]
  );

  // Send email notification asynchronously (non-blocking)
  sendContactEmail(name.trim(), email.trim(), message.trim());

  res.status(201).json({
    success: true,
    message: 'Message sent successfully!',
    data: result.rows[0],
  });
});

module.exports = { createMessage };
