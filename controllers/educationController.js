const { pool } = require('../database/db');
const catchAsyncError = require('../utils/catchAsyncError');

const getEducation = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM education ORDER BY sort_order, created_at DESC');
  res.json({ success: true, data: result.rows });
});

const createEducation = catchAsyncError(async (req, res) => {
  const { institution, degree, period, status, sort_order } = req.body;
  const result = await pool.query(
    'INSERT INTO education (institution, degree, period, status, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [institution.trim(), degree.trim(), period.trim(), status?.trim() || 'Undergraduate', sort_order ?? 0]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateEducation = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { institution, degree, period, status, sort_order } = req.body;
  const result = await pool.query(
    'UPDATE education SET institution=$1, degree=$2, period=$3, status=$4, sort_order=$5 WHERE id=$6 RETURNING *',
    [institution.trim(), degree.trim(), period.trim(), status?.trim() || 'Undergraduate', sort_order ?? 0, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Education not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteEducation = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM education WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Education not found.' });
  res.json({ success: true, message: 'Education deleted.' });
});

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
