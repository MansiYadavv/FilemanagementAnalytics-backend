const Submission = require('../models/userSubmissionModel');
const FileUpload = require('../models/fileModel');
const User = require('../models/userModel');

exports.topUsers = async (req, res) => {
  try {
    const result = await Submission.aggregate([
      // Group submissions by userId and count total submissions
      { $group: { _id: "$userId", totalSubmissions: { $sum: 1 } } },
      { $sort: { totalSubmissions: -1 } },
      { $limit: 3 },
      // Lookup user info from 'users' collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          userId: "$_id",
          name: "$userInfo.name",
          totalSubmissions: 1
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    console.error('Error fetching top users:', error);
    res.status(500).json({ message: 'Failed to fetch top users', error });
  }
};

// GET /api/analytics/files-report
exports.filesReport = async (req, res) => {
  try {
    const result = await Submission.aggregate([
      // Join file details with submissions
      {
        $lookup: {
          from: "fileuploads", // confirm collection name here
          localField: "files",
          foreignField: "_id",
          as: "fileDetails"
        }
      },
      { $unwind: "$fileDetails" },
      // Group by category and fileType and count files
      {
        $group: {
          _id: {
            category: "$category",
            fileType: "$fileDetails.fileType"
          },
          count: { $sum: 1 }
        }
      },
      // Group counts by category, pushing fileType counts as key-value pairs
      {
        $group: {
          _id: "$_id.category",
          files: {
            $push: {
              k: "$_id.fileType",
              v: "$count"
            }
          }
        }
      },
      // Transform array of key-value pairs to object
      {
        $project: {
          _id: 0,
          category: "$_id",
          files: { $arrayToObject: "$files" }
        }
      }
    ]);

    // Convert to object keyed by category
    const formatted = {};
    result.forEach(r => {
      formatted[r.category] = r.files;
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error generating files report:', error);
    res.status(500).json({ message: 'Failed to generate files report', error });
  }
};
