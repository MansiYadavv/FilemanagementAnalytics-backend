


// module.exports = router;
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads'); 
const { processUploadedFile } = require('../middleware/fileProcessor');
const auth = require('../middleware/auth'); 
const { uploadFile } = require('../controller/fileController');

// Allow all authenticated users
router.post(
  '/upload',
  auth(),                       
  upload.single('file'),
  processUploadedFile,
  uploadFile
);

module.exports = router;
