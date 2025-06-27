const Submission = require('../models/userSubmissionModel');
const FileUpload = require('../models/fileModel');

class AnalyticsService {
  static async getTopUsers(limit = 3) {
    try {
      const pipeline = [
        {
          $group: {
            _id: '$userId',
            totalSubmissions: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $project: {
            userId: '$_id',
            name: '$userInfo.name',
            totalSubmissions: 1,
            _id: 0
          }
        },
        {
          $sort: { totalSubmissions: -1 }
        },
        {
          $limit: limit
        }
      ];

      return await Submission.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }

  static async getFilesReport() {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'submissions',
            localField: 'submissionId',
            foreignField: '_id',
            as: 'submission'
          }
        },
        {
          $unwind: '$submission'
        },
        {
          $group: {
            _id: {
              category: '$submission.category',
              fileType: '$fileType'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.category',
            files: {
              $push: {
                type: '$_id.fileType',
                count: '$count'
              }
            }
          }
        },
        {
          $project: {
            category: '$_id',
            files: {
              $arrayToObject: {
                $map: {
                  input: '$files',
                  as: 'file',
                  in: {
                    k: '$$file.type',
                    v: '$$file.count'
                  }
                }
              }
            },
            _id: 0
          }
        }
      ];

      const results = await FileUpload.aggregate(pipeline);
      
      // Transform results to match expected format
      const report = {};
      results.forEach(item => {
        report[item.category] = {
          pdf: item.files.pdf || 0,
          image: item.files.image || 0
        };
      });

      return report;
    } catch (error) {
      throw error;
    }
  }

  static async getOverallStats() {
    try {
      const totalUsers = await require('../models/User').countDocuments();
      const totalSubmissions = await Submission.countDocuments();
      const totalFiles = await FileUpload.countDocuments();

      return {
        totalUsers,
        totalSubmissions,
        totalFiles
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AnalyticsService;