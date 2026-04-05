import { body } from 'express-validator'

export const registerValidator = [
  body('username')
    .trim().escape()
    .notEmpty().withMessage('Username is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .normalizeEmail()
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
    .matches(/\d/).withMessage('Password must include at least one number'),
]

export const loginValidator = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Identifier is required'),
  body('password').notEmpty().withMessage('Password is required'),
]