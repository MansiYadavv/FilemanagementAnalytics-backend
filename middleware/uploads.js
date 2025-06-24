
const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png, .webp, .svg, .pdf files are allowed"), false);
  }
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max size
  }
});


module.exports = upload;


// const File = require('../models/fileModel');
// const { extractMetadata } = require('../utils/fileUtils');

// exports.uploadFile = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ error: "No file uploaded" });

//     const metadata = await extractMetadata(file);

//     const newFile = new File({
//       filename: file.filename,
//       originalName: file.originalname,
//       path: file.path,
//       mimetype: file.mimetype,
//       size: file.size,
//       metadata,
//       uploadedBy: req.user._id, // ✅ uses user from JWT
//       status: 'ready'
//     });

//     await newFile.save();

//     res.status(201).json({
//       message: "File uploaded successfully",
//       file: newFile
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: "File upload failed" });
//   }
// };
// module.exports = upload;













// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "image/svg+xml",
//       "application/pdf"
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .jpeg, .jpg, .png, .webp, .svg, .pdf files are allowed"), false);
//     }
//   }
// });

// module.exports = upload.single("file"); // Field name = "file"

