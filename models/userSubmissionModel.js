
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Research', 'Application', 'Report', 'Other'],
    default: 'Other'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FileUpload'
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
submissionSchema.index({ userId: 1 });
submissionSchema.index({ category: 1 });
submissionSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);