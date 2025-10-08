const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// User registration validation
const registerValidation = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  phone: Joi.string()
    .pattern(/^[+]?[1-9]\\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  country: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional(),
  
  userType: Joi.string()
    .valid('traveler', 'provider')
    .default('traveler')
});

// User login validation
const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    }),
  
  userType: Joi.string()
    .valid('traveler', 'provider')
    .required()
    .messages({
      'any.required': 'User type is required',
      'any.only': 'User type must be either traveler or provider'
    })
});

// Booking validation
const bookingValidation = Joi.object({
  experienceId: Joi.string()
    .required()
    .messages({
      'any.required': 'Experience ID is required'
    }),
  
  date: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Booking date must be in the future',
      'any.required': 'Booking date is required'
    }),
  
  participants: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.min': 'At least 1 participant is required',
      'number.max': 'Maximum 20 participants allowed',
      'any.required': 'Number of participants is required'
    }),
  
  specialRequests: Joi.string()
    .max(500)
    .optional()
});

// Experience creation validation
const experienceValidation = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(100)
    .required(),
  
  description: Joi.string()
    .trim()
    .min(20)
    .max(2000)
    .required(),
  
  location: Joi.string()
    .trim()
    .min(5)
    .max(100)
    .required(),
  
  type: Joi.string()
    .valid('hiking', 'wildlife-watching', 'cultural', 'adventure', 'educational', 'conservation')
    .required(),
  
  price: Joi.number()
    .positive()
    .max(10000)
    .required(),
  
  maxParticipants: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .required(),
  
  duration: Joi.number()
    .positive()
    .max(168) // Max 7 days in hours
    .required(),
  
  difficulty: Joi.string()
    .valid('easy', 'moderate', 'challenging', 'expert')
    .required(),
  
  sustainabilityFeatures: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
});

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  bookingValidation,
  experienceValidation
};