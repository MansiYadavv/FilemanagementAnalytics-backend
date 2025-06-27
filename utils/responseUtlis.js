class ResponseUtils {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }

  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      error: message
    });
  }

  static badRequest(res, message = 'Bad request') {
    return res.status(400).json({
      success: false,
      error: message
    });
  }
}

module.exports = ResponseUtils;