
const SubmissionService = require('../service/submissionService');
const ResponseUtils = require('../utils/responseUtlis');

class SubmissionController {
  static async createSubmission(req, res, next) {
    try {
      const submission = await SubmissionService.createSubmission(req.body, req.files);
      ResponseUtils.success(res, submission, 'Submission created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getSubmission(req, res, next) {
    try {
      const submission = await SubmissionService.getSubmissionById(req.params.id);
      ResponseUtils.success(res, submission);
    } catch (error) {
      if (error.message === 'Submission not found') {
        ResponseUtils.notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  static async getAllSubmissions(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await SubmissionService.getAllSubmissions(page, limit);
      ResponseUtils.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubmissionController;