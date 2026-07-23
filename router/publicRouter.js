const express = require('express');
const { getSettings } = require('../controllers/settingsController');
const { getSkills }   = require('../controllers/skillsController');
const { getEducation } = require('../controllers/educationController');
const { getExperience } = require('../controllers/experienceController');
const { getServices } = require('../controllers/servicesController');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

router.get('/settings', getSettings);
router.get('/skills', getSkills);
router.get('/education', getEducation);
router.get('/experience', getExperience);
router.get('/services', getServices);

module.exports = router;
