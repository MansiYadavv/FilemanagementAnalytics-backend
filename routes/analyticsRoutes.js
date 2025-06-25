const express = require('express');
const { topUsers, filesReport } = require('../controller/analyticsController');

const router = express.Router();

router.get('/top-users', topUsers);
router.get('/files-report', filesReport);

module.exports = router;
