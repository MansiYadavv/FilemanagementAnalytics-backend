
const UserService = require('../service/userService');
const ResponseUtils = require('../utils/responseUtlis');

class UserController {
  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      ResponseUtils.success(res, user, 'User created successfully', 201);
    } catch (error) {
      if (error.message.includes('already exists')) {
        ResponseUtils.badRequest(res, error.message);
      } else {
        next(error);
      }
    }
  }

  static async getUser(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      ResponseUtils.success(res, user);
    } catch (error) {
      if (error.message === 'User not found') {
        ResponseUtils.notFound(res, error.message);
      } else {
        next(error);
      }
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      ResponseUtils.success(res, users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;