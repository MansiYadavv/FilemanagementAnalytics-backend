
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number, // for video/audio
    pages: Number,    // for PDF
    encoding: String,
    checksum: String,
    exifData: mongoose.Schema.Types.Mixed
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'error'],
    default: 'processing'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: file URL
FileSchema.virtual('url').get(function () {
  return `/uploads/${this.filename}`;
});

// Virtual: category based on mimetype
FileSchema.virtual('category').get(function () {
  const type = this.mimetype.split('/')[0];
  switch (type) {
    case 'image': return 'image';
    case 'video': return 'video';
    case 'audio': return 'audio';
    case 'text': return 'document';
    case 'application':
      if (this.mimetype.includes('pdf')) return 'document';
      if (this.mimetype.includes('zip') || this.mimetype.includes('rar')) return 'archive';
      return 'document';
    default: return 'other';
  }
});

// Indexes for performance
FileSchema.index({ uploadedBy: 1, createdAt: -1 });
FileSchema.index({ mimetype: 1 });
FileSchema.index({ tags: 1 });
FileSchema.index({ status: 1 });
FileSchema.index({ 'metadata.checksum': 1 });

module.exports = mongoose.model('File', FileSchema);
