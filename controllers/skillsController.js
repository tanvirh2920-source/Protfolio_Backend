const { pool } = require('../database/db');
const catchAsyncError = require('../utils/catchAsyncError');

const getSkills = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM skills ORDER BY category, sort_order, name');
  res.json({ success: true, data: result.rows });
});

const createSkill = catchAsyncError(async (req, res) => {
  const { name, category, sort_order } = req.body;
  const result = await pool.query(
    'INSERT INTO skills (name, category, sort_order) VALUES ($1,$2,$3) RETURNING *',
    [name.trim(), category?.trim() || 'Other', sort_order ?? 0]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateSkill = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { name, category, sort_order } = req.body;
  const result = await pool.query(
    'UPDATE skills SET name=$1, category=$2, sort_order=$3 WHERE id=$4 RETURNING *',
    [name.trim(), category?.trim() || 'Other', sort_order ?? 0, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Skill not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteSkill = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM skills WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Skill not found.' });
  res.json({ success: true, message: 'Skill deleted.' });
});

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
