const { pool } = require('../database/db');
const catchAsyncError = require('../utils/catchAsyncError');

/**
 * GET /api/projects — Fetch all projects sorted by newest first.
 */
const getAllProjects = catchAsyncError(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM projects ORDER BY created_at DESC'
  );
  res.json({ success: true, data: result.rows });
});

/**
 * GET /api/projects/:id — Fetch a single project by ID.
 */
const getProjectById = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, error: 'Project not found.' });
  }

  res.json({ success: true, data: result.rows[0] });
});

module.exports = { getAllProjects, getProjectById };
