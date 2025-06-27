const Submission = require('../models/userSubmissionModel');
const FileService = require('./fileService');

class SubmissionService {
  static async createSubmission(submissionData, files) {
    try {
      // Create submission without files first
      const submission = new Submission({
        title: submissionData.title,
        description: submissionData.description,
        category: submissionData.category,
        userId: submissionData.userId,
        files: []
      });

      await submission.save();

      // Process and save files
      if (files && files.length > 0) {
        const fileIds = await FileService.processAndSaveFiles(files, submission._id);
        submission.files = fileIds;
        await submission.save();
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async getSubmissionById(id) {
    try {
      const submission = await Submission.findById(id)
        .populate('userId', 'name email')
        .populate('files');

      if (!submission) {
        throw new Error('Submission not found');
      }

      return submission;
    } catch (error) {
      throw error;
    }
  }

  static async getAllSubmissions(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const submissions = await Submission.find()
        .populate('userId', 'name email')
        .populate('files')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Submission.countDocuments();

      return {
        submissions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SubmissionService;