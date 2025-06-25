
// const express = require('express');
// const { createSubmission, getAnalytics } = require('../controller/submissionController');

// const router = express.Router();

// router.post('/create', createSubmission);
// router.get('/analytics', getAnalytics);

// module.exports = router;

const express = require('express');
const { createSubmission, getSubmissionById } = require('../controller/submissionController');
const upload = require('../middleware/uploads'); 

const router = express.Router();

// Create submission with multiple files (field name: "files")
router.post('/create', upload.array('files'), createSubmission);

// Get submission details by id (with user & files info)
router.get('/getById/:id', getSubmissionById);

module.exports = router;
