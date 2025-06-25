const Submission = require('../models/userSubmissionModel');
const FileUpload = require('../models/fileModel');
const User = require('../models/userModel');


exports.topUsers = async (req, res) => {
  try {
    const result = await Submission.aggregate([
      { $group: { _id: "$userId", totalSubmissions: { $sum: 1 } } },
      { $sort: { totalSubmissions: -1 } },
      { $limit: 3 },
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
    res.status(500).json({ message: 'Failed to fetch top users', error });
  }
};

// GET /api/analytics/files-report
exports.filesReport = async (req, res) => {
  try {
    const result = await Submission.aggregate([
      {
        $lookup: {
          from: "fileuploads",
          localField: "files",
          foreignField: "_id",
          as: "fileDetails"
        }
      },
      { $unwind: "$fileDetails" },
      {
        $group: {
          _id: {
            category: "$category",
            fileType: "$fileDetails.fileType"
          },
          count: { $sum: 1 }
        }
      },
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
      {
        $project: {
          _id: 0,
          category: "$_id",
          files: { $arrayToObject: "$files" }
        }
      }
    ]);

    // Format output
    const formatted = {};
    result.forEach(r => {
      formatted[r.category] = r.files;
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate files report', error });
  }
};
