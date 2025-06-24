
const express = require('express');
const { createSubmission, getAnalytics } = require('../controller/submissionController');

const router = express.Router();

router.post('/create', createSubmission);
router.get('/analytics', getAnalytics);

module.exports = router;