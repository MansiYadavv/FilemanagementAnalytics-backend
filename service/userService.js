const User = require('../models/userModel');

class UserService {
  static async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return await User.find().sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;