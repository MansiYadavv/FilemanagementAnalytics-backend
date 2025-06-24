// const mongoose = require('mongoose');
// const submissionSchema = new mongoose.Schema({
//   user: { type: mongoose.Types.ObjectId, ref: 'User' },
//   title: String, description: String,
//   filePath: String, 
//   status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
// }, { timestamps: true });
// module.exports = mongoose.model('Submission', submissionSchema);

const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  submissionDate: { type: Date, default: Date.now },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  metadata: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Submission', SubmissionSchema);
