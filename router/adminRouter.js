const express = require('express');
const { body, param } = require('express-validator');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const {
  login, updateAccount,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
  getAllMessages,
  toggleMessageRead,
  deleteMessage,
} = require('../controllers/adminController');
const { updateSettings } = require('../controllers/settingsController');
const { createSkill, updateSkill, deleteSkill } = require('../controllers/skillsController');
const { createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { createService, updateService, deleteService } = require('../controllers/servicesController');

const router = express.Router();

// ─── Auth ────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validateMiddleware,
  login
);

// ─── All routes below require authentication ────────────────
router.use(isAuthenticated);

// Settings
router.put('/settings', updateSettings);

// Account
router.put('/account', updateAccount);

// Skills CRUD
router.post(
  '/skills',
  [
    body('name').trim().notEmpty().withMessage('Skill name is required.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
  ],
  validateMiddleware,
  createSkill
);
router.put(
  '/skills/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid skill ID.'),
    body('name').trim().notEmpty().withMessage('Skill name is required.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
  ],
  validateMiddleware,
  updateSkill
);
router.delete('/skills/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteSkill);

// Projects CRUD
router.get('/projects', getAllProjectsAdmin);
router.post(
  '/projects',
  [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 150 }),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('tech_stack').optional().isArray().withMessage('Tech stack must be an array.'),
    body('github_link').optional({ values: 'falsy' }).isURL().withMessage('Invalid GitHub URL.'),
    body('demo_link').optional({ values: 'falsy' }).isURL().withMessage('Invalid demo URL.'),
    body('image_url').optional({ values: 'falsy' }).isString(),
    body('featured').optional().isBoolean(),
  ],
  validateMiddleware,
  createProject
);
router.put(
  '/projects/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid project ID.'),
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 150 }),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('tech_stack').optional().isArray().withMessage('Tech stack must be an array.'),
    body('github_link').optional({ values: 'falsy' }).isURL().withMessage('Invalid GitHub URL.'),
    body('demo_link').optional({ values: 'falsy' }).isURL().withMessage('Invalid demo URL.'),
    body('image_url').optional({ values: 'falsy' }).isString(),
    body('featured').optional().isBoolean(),
  ],
  validateMiddleware,
  updateProject
);
router.delete('/projects/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteProject);

// Messages
router.get('/messages', getAllMessages);
router.patch('/messages/:id', param('id').isInt({ min: 1 }), validateMiddleware, toggleMessageRead);
router.delete('/messages/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteMessage);

// Education CRUD
router.post(
  '/education',
  [
    body('institution').trim().notEmpty().withMessage('Institution is required.'),
    body('degree').trim().notEmpty().withMessage('Degree is required.'),
    body('period').trim().notEmpty().withMessage('Period is required.'),
    body('status').optional().trim(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  createEducation
);
router.put(
  '/education/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid education ID.'),
    body('institution').trim().notEmpty().withMessage('Institution is required.'),
    body('degree').trim().notEmpty().withMessage('Degree is required.'),
    body('period').trim().notEmpty().withMessage('Period is required.'),
    body('status').optional().trim(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  updateEducation
);
router.delete('/education/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteEducation);

// Experience CRUD
router.post(
  '/experience',
  [
    body('role').trim().notEmpty().withMessage('Role is required.'),
    body('company').trim().notEmpty().withMessage('Company is required.'),
    body('period').trim().notEmpty().withMessage('Period is required.'),
    body('description').optional().isArray().withMessage('Description must be an array.'),
    body('current').optional().isBoolean(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  createExperience
);
router.put(
  '/experience/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid experience ID.'),
    body('role').trim().notEmpty().withMessage('Role is required.'),
    body('company').trim().notEmpty().withMessage('Company is required.'),
    body('period').trim().notEmpty().withMessage('Period is required.'),
    body('description').optional().isArray().withMessage('Description must be an array.'),
    body('current').optional().isBoolean(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  updateExperience
);
router.delete('/experience/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteExperience);

// Services CRUD
router.post(
  '/services',
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('icon_name').optional().trim(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  createService
);
router.put(
  '/services/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid service ID.'),
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('icon_name').optional().trim(),
    body('sort_order').optional().isInt(),
  ],
  validateMiddleware,
  updateService
);
router.delete('/services/:id', param('id').isInt({ min: 1 }), validateMiddleware, deleteService);

module.exports = router;
