const express = require('express')
const noteController = require('../controllers/note')
const authMiddleware = require('../middlewares/authMiddleware')
const { body, param } = require('express-validator')

const router = express.Router()

router.use(authMiddleware.authenticate)

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the note
 *               body:
 *                 type: string
 *                 description: Body of the note
 *     responses:
 *       '201':
 *         description: Note created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  '/notes',
  [
    body('title').isString().notEmpty().trim().escape(),
    body('body').isString().notEmpty().trim().escape(),
  ],
  noteController.createNote,
)

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '500':
 *         description: Internal Server Error
 */
router.get('/notes', noteController.getNotes)

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/NoteId'
 *     responses:
 *       '200':
 *         description: The requested note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.get('/notes/:id', [param('id').isMongoId()], noteController.getNote)

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/NoteId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title for the note
 *               body:
 *                 type: string
 *                 description: New body for the note
 *     responses:
 *       '200':
 *         description: Note updated successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.put(
  '/notes/:id',
  [
    param('id').isMongoId(),
    body('title').isString().notEmpty().trim().escape(),
    body('body').isString().notEmpty().trim().escape(),
  ],
  noteController.updateNote,
)

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a specific note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/NoteId'
 *     responses:
 *       '204':
 *         description: Note deleted successfully
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete(
  '/notes/:id',
  [param('id').isMongoId()],
  noteController.deleteNote,
)

/**
 * @swagger
 * /api/notes/{id}/share:
 *   post:
 *     summary: Share a note with another user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/NoteId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sharedWith:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: User IDs to share the note with
 *     responses:
 *       '200':
 *         description: Note shared successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         $ref: '#/components/responses/UnauthorizedError'
 *       '404':
 *         description: Note not found
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  '/:id/share',
  [
    param('id').isMongoId(),
    body('sharedWith')
      .isArray()
      .notEmpty()
      .withMessage('Must provide at least one user ID')
      .toArray(),
  ],
  noteController.shareNote,
)

module.exports = router
