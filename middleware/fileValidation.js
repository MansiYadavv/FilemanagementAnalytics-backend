const fileValidation = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one file is required'
    });
  }

  // Check file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));

  if (invalidFiles.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Only .jpg, .png, and .pdf files are allowed'
    });
  }

  next();
};

module.exports = fileValidation;