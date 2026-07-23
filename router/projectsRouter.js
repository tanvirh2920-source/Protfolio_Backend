const express = require('express');
const { param } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { getAllProjects, getProjectById } = require('../controllers/projectController');

const router = express.Router();

// GET /api/projects — Fetch all projects
router.get('/', getAllProjects);

// GET /api/projects/:id — Fetch single project
router.get('/:id', param('id').isInt({ min: 1 }), validateMiddleware, getProjectById);

module.exports = router;
