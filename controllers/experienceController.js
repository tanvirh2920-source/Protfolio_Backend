const { pool } = require('../database/db');
const catchAsyncError = require('../utils/catchAsyncError');

const getExperience = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM experience ORDER BY sort_order, created_at DESC');
  res.json({ success: true, data: result.rows });
});

const createExperience = catchAsyncError(async (req, res) => {
  const { role, company, period, description, current, sort_order } = req.body;
  const result = await pool.query(
    'INSERT INTO experience (role, company, period, description, current, sort_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [role.trim(), company.trim(), period.trim(), description || [], current || false, sort_order ?? 0]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateExperience = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { role, company, period, description, current, sort_order } = req.body;
  const result = await pool.query(
    'UPDATE experience SET role=$1, company=$2, period=$3, description=$4, current=$5, sort_order=$6 WHERE id=$7 RETURNING *',
    [role.trim(), company.trim(), period.trim(), description || [], current || false, sort_order ?? 0, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Experience not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteExperience = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM experience WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Experience not found.' });
  res.json({ success: true, message: 'Experience deleted.' });
});

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
