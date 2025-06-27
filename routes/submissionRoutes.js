
const express = require('express');
const SubmissionController = require('../controller/submissionController');
const { validate, submissionValidation } = require('../middleware/userValidation');
const fileValidation = require('../middleware/fileValidation');
const upload = require('../config/multer');

const router = express.Router();


router.post('/create', 
  upload.array('files', 10), // Allow up to 10 files
  fileValidation,
  validate(submissionValidation.createSubmission),
  SubmissionController.createSubmission
);

//  Get submission by ID
router.get('/get/:id', SubmissionController.getSubmission);

//  Get all submissions with pagination
router.get('/getAll', SubmissionController.getAllSubmissions);

module.exports = router;