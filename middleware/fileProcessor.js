const { extractMetadata } = require('../utils/fileUtils');

exports.processUploadedFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const metadata = await extractMetadata(file);
    req.file.metadata = metadata; // attach to request for controller use
    next();
  } catch (err) {
    console.error('Metadata processing error:', err);
    res.status(500).json({ error: 'Metadata extraction failed' });
  }
};
