const bcrypt = require('bcryptjs');
const { pool } = require('../database/db');
const { generateToken } = require('../utils/jwtToken');
const catchAsyncError = require('../utils/catchAsyncError');

/**
 * POST /api/admin/login
 */
const login = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM admins WHERE email = $1',
    [email.trim().toLowerCase()]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  const admin = result.rows[0];
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  const token = generateToken({ id: admin.id, email: admin.email });

  res.json({ success: true, token, admin: { id: admin.id, email: admin.email } });
});

/**
 * PUT /api/admin/account — change email and/or password
 */
const updateAccount = catchAsyncError(async (req, res) => {
  const adminId = req.admin.id;
  const { current_password, new_email, new_password } = req.body;

  const result = await pool.query('SELECT * FROM admins WHERE id = $1', [adminId]);
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Admin not found.' });
  }

  const admin = result.rows[0];

  const isMatch = await bcrypt.compare(current_password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
  }

  const updatedEmail    = new_email?.trim().toLowerCase() || admin.email;
  const updatedPassword = new_password
    ? await bcrypt.hash(new_password, 10)
    : admin.password;

  if (updatedEmail !== admin.email) {
    const conflict = await pool.query(
      'SELECT id FROM admins WHERE email = $1 AND id != $2',
      [updatedEmail, adminId]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'That email is already in use.' });
    }
  }

  await pool.query(
    'UPDATE admins SET email = $1, password = $2 WHERE id = $3',
    [updatedEmail, updatedPassword, adminId]
  );

  res.json({ success: true, message: 'Account updated successfully.' });
});

/**
 * Project Admin CRUD
 */
const getAllProjectsAdmin = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
});

const createProject = catchAsyncError(async (req, res) => {
  const { title, description, tech_stack, github_link, demo_link, image_url, featured } = req.body;
  const result = await pool.query(
    `INSERT INTO projects (title, description, tech_stack, github_link, demo_link, image_url, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title.trim(), description.trim(), tech_stack || [], github_link?.trim() || null,
     demo_link?.trim() || null, image_url?.trim() || null, featured || false]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateProject = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { title, description, tech_stack, github_link, demo_link, image_url, featured } = req.body;
  const result = await pool.query(
    `UPDATE projects SET title=$1, description=$2, tech_stack=$3, github_link=$4,
     demo_link=$5, image_url=$6, featured=$7 WHERE id=$8 RETURNING *`,
    [title.trim(), description.trim(), tech_stack || [], github_link?.trim() || null,
     demo_link?.trim() || null, image_url?.trim() || null, featured || false, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Project not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteProject = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM projects WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Project not found.' });
  res.json({ success: true, message: 'Project deleted successfully.' });
});

/**
 * Message Management
 */
const getAllMessages = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
});

const toggleMessageRead = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'UPDATE messages SET read = NOT read WHERE id=$1 RETURNING *', [id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Message not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteMessage = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM messages WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Message not found.' });
  res.json({ success: true, message: 'Message deleted successfully.' });
});

module.exports = {
  login,
  updateAccount,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  getAllMessages,
  toggleMessageRead,
  deleteMessage,
};
