// const File = require('../models/fileModel');
// const { extractImageMetadata } = require('../utils/fileUtils');

// exports.uploadFile = async (req, res) => {
//   try {
//     const { filename, path, mimetype, size } = req.file;
//     const metadata = await extractImageMetadata(path);
//     const newFile = new File({ filename, path, mimetype, size, metadata });
//     await newFile.save();
//     res.status(201).json(newFile);
//   } catch (err) {
//     res.status(500).json({ error: 'File upload failed' });
//   }
// };

// const File = require('../models/fileModel');
// const { extractImageMetadata } = require('../utils/fileUtils');

// exports.uploadFile = async (req, res) => {
//   try {
//     const { filename, path, mimetype, size } = req.file;
//     const metadata = await extractImageMetadata(path);

//     const newFile = new File({
//       filename,
//       path,
//       mimetype,
//       size,
//       metadata,
//     });

//     await newFile.save();
//     res.status(201).json(newFile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "File upload failed" });
//   }
// };




const File = require('../models/fileModel');
const { extractMetadata } = require('../utils/fileUtils');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user; // Assuming `auth` middleware attaches user to req

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!user) return res.status(401).json({ error: "User not authenticated" });

    const metadata = await extractMetadata(file);

    const newFile = new File({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: user._id,
      metadata,
      status: 'ready' // Optional: Set to 'processing' if metadata runs async
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: "File upload failed" });
  }
};









// const File = require('../models/fileModel');
// const { extractMetadata } = require('../utils/fileUtils'); // the combined extractor

// exports.uploadFile = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: "No file uploaded" });

//     // Pass the whole file object (with path and mimetype)
//     const metadata = await extractMetadata(file);

//     const newFile = new File({
//       filename: file.filename,
//       path: file.path,
//       mimetype: file.mimetype,
//       size: file.size,
//       metadata,
//     });

//     await newFile.save();
//     res.status(201).json(newFile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "File upload failed" });
//   }
// };
