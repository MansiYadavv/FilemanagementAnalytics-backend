const Submission = require('../models/userSubmissionModel');
const FileUpload = require('../models/fileModel');
const User = require('../models/userModel');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');


async function extractMetadata(file) {
  if (file.mimetype.startsWith('image/')) {
    const metadata = await sharp(file.path).metadata();
    return {
      fileType: 'image',
      fileMeta: {
        size: file.size,
        dimensions: { width: metadata.width, height: metadata.height },
      },
    };
  } else if (file.mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    return {
      fileType: 'pdf',
      fileMeta: {
        size: file.size,
        pageCount: pdfData.numpages,
      },
    };
  } else {
    throw new Error('Unsupported file type');
  }
}

// POST /api/submissions
exports.createSubmission = async (req, res) => {
  try {
    const { title, description, category, userId } = req.body;

    if (!title || !category || !userId) {
      return res.status(400).json({ message: 'Title, category, and userId are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one file must be uploaded' });
    }

    const filesData = [];

    for (const file of req.files) {
      const meta = await extractMetadata(file);

      const fileUpload = new FileUpload({
        submissionId: null, // Will update after submission created
        fileType: meta.fileType,
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        metadata: meta.fileMeta,
        uploadedAt: new Date(),
        status: 'ready',
      });

      await fileUpload.save();
      filesData.push(fileUpload);
    }

    const submission = new Submission({
      title,
      description,
      category,
      userId,
      files: filesData.map(f => f._id),
      submittedAt: new Date(),
    });

    await submission.save();

    // Update submissionId in each file document
    await Promise.all(
      filesData.map(async (fileDoc) => {
        fileDoc.submissionId = submission._id;
        await fileDoc.save();
      })
    );

    res.status(201).json({ message: 'Submission created', submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// GET /api/submissions/:id
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('files');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
};

