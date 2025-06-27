const Joi = require('joi');

const userValidation = {
  createUser: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required()
  })
};

const submissionValidation = {
  createSubmission: Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    category: Joi.string().valid('Research', 'Application', 'Report', 'Other').required(),
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validate,
  userValidation,
  submissionValidation
};