

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