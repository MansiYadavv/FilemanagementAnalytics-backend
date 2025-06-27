
const AnalyticsService = require('../service/analyticService');
const ResponseUtils = require('../utils/responseUtlis');

class AnalyticsController {
  static async getTopUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 3;
      const topUsers = await AnalyticsService.getTopUsers(limit);
      ResponseUtils.success(res, topUsers);
    } catch (error) {
      next(error);
    }
  }

  static async getFilesReport(req, res, next) {
    try {
      const report = await AnalyticsService.getFilesReport();
      ResponseUtils.success(res, report);
    } catch (error) {
      next(error);
    }
  }

  static async getOverallStats(req, res, next) {
    try {
      const stats = await AnalyticsService.getOverallStats();
      ResponseUtils.success(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;