
const File = require('../models/fileModel');
const { extractMetadata } = require('../utils/fileUtils');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user; // Auth middleware must set this

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!user) return res.status(401).json({ error: "User not authenticated" });

    // Extract metadata based on file type
    const metadata = await extractMetadata(file);

    const newFile = new File({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: user._id,
      metadata,
      status: 'ready',
      uploadedAt: new Date()
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "File upload failed", details: err.message });
  }
};
