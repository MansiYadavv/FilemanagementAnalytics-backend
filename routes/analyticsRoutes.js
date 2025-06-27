
const express = require('express');
const AnalyticsController = require('../controller/analyticsController');

const router = express.Router();

// GET /api/analytics/top-users - Get top users by submissions
router.get('/top-users', AnalyticsController.getTopUsers);

// GET /api/analytics/files-report - Get files report grouped by category and type
router.get('/files-report', AnalyticsController.getFilesReport);

// GET /api/analytics/stats - Get overall statistics
router.get('/stats', AnalyticsController.getOverallStats);

module.exports = router;