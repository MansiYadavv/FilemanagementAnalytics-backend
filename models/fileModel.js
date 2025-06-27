
const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: [true, 'Submission ID is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image', 'pdf']
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileMeta: {
    size: {
      type: Number,
      required: [true, 'File size is required']
    },
    dimensions: {
      width: Number,
      height: Number
    },
    pageCount: Number
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
fileUploadSchema.index({ submissionId: 1 });
fileUploadSchema.index({ fileType: 1 });

module.exports = mongoose.model('FileUpload', fileUploadSchema);