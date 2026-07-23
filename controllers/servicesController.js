const { pool } = require('../database/db');
const catchAsyncError = require('../utils/catchAsyncError');

const getServices = catchAsyncError(async (req, res) => {
  const result = await pool.query('SELECT * FROM services ORDER BY sort_order, created_at DESC');
  res.json({ success: true, data: result.rows });
});

const createService = catchAsyncError(async (req, res) => {
  const { title, description, icon_name, sort_order } = req.body;
  const result = await pool.query(
    'INSERT INTO services (title, description, icon_name, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [title.trim(), description.trim(), icon_name?.trim() || 'code', sort_order ?? 0]
  );
  res.status(201).json({ success: true, data: result.rows[0] });
});

const updateService = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { title, description, icon_name, sort_order } = req.body;
  const result = await pool.query(
    'UPDATE services SET title=$1, description=$2, icon_name=$3, sort_order=$4 WHERE id=$5 RETURNING *',
    [title.trim(), description.trim(), icon_name?.trim() || 'code', sort_order ?? 0, id]
  );
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Service not found.' });
  res.json({ success: true, data: result.rows[0] });
});

const deleteService = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM services WHERE id=$1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Service not found.' });
  res.json({ success: true, message: 'Service deleted.' });
});

module.exports = { getServices, createService, updateService, deleteService };
