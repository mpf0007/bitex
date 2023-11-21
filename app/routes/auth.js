/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmVhNjBlN2UxN2EzYTAwMTJhMzhmZDciLCJpYXQiOjE2MTg1NDUyMjksImV4cCI6MTYxODU0ODgyOX0.-example-token

 *   responses:
 *     UnauthorizedError:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Error message
 *             example:
 *               message: Unauthorized access
 */

const express = require('express')
const { body } = require('express-validator')
const authController = require('../controllers/auth')

const router = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 minLength: 5
 *               password:
 *                 type: string
 *                 description: User's password
 *                 minLength: 5
 *     responses:
 *       '200':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  '/register',
  [
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 5 }),
  ],
  authController.register,
)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 minLength: 5
 *               password:
 *                 type: string
 *                 description: User's password
 *                 minLength: 5
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  '/login',
  [
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 5 }),
  ],
  authController.login,
)

module.exports = router
