// const Submission = require('../models/Submission');
// const fs = require('fs');

// exports.createSubmission = async (req, res) => {
//   try {
//     const sub = new Submission({
//       user: req.user.userId,
//       title: req.body.title,
//       description: req.body.description,
//       filePath: req.file?.path || null,
//     });
//     await sub.save();
//     res.status(201).json(sub);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getSubmissions = async (req, res) => {
//   try {
//     const filter = req.user.role === 'admin' ? {} : { user: req.user.userId };
//     const subs = await Submission.find(filter).populate('user', 'name email');
//     res.json(subs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.updateSubmission = async (req, res) => {
//   try {
//     const sub = await Submission.findById(req.params.id);
//     if (!sub) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'user' && sub.user.toString() !== req.user.userId)
//       return res.status(403).json({ message: 'Unauthorized' });

//     if (req.user.role === 'admin' && req.body.status) sub.status = req.body.status;
//     if (req.body.title) sub.title = req.body.title;
//     if (req.body.description) sub.description = req.body.description;
//     if (req.file) {
//       if (sub.filePath) fs.unlinkSync(sub.filePath); // optional: clean old file
//       sub.filePath = req.file.path;
//     }

//     await sub.save();
//     res.json(sub);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteSubmission = async (req, res) => {
//   try {
//     const sub = await Submission.findById(req.params.id);
//     if (!sub) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'user' && sub.user.toString() !== req.user.userId)
//       return res.status(403).json({ message: 'Unauthorized' });

//     if (sub.filePath) fs.unlinkSync(sub.filePath); // clean file
//     await sub.remove();

//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const Submission = require('../models/userSubmissionModel');

exports.createSubmission = async (req, res) => {
  try {
    const { userId, title, description, fileIds } = req.body;
    const submission = new Submission({
      user: userId,
      title,
      description,
      files: fileIds,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: 'Submission creation failed' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const data = await Submission.aggregate([
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          submissionsPerUser: { $push: "$user" },
        }
      },
      // Additional pipelines for detailed analytics
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Analytics retrieval failed' });
  }
};