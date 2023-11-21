const { validationResult } = require('express-validator')
const Note = require('../models/note')
const User = require('../models/user')

const createNote = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, body } = req.body
  const userId = req.user.id

  try {
    const newNote = new Note({
      title,
      body,
      user: userId,
    })

    const note = await newNote.save()
    res.json(note)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const getNotes = async (req, res) => {
  const userId = req.user.id

  try {
    const notes = await Note.find({ user: userId })
    res.json(notes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const getNote = async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.id

  try {
    const note = await Note.findOne({ _id: noteId, user: userId })

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    res.json(note)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const updateNote = async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.id

  try {
    let note = await Note.findOne({ _id: noteId, user: userId })

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    const { title, body } = req.body

    note.title = title || note.title
    note.body = body || note.body

    note = await note.save()
    res.json(note)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const deleteNote = async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.id

  try {
    const note = await Note.findOne({ _id: noteId, user: userId })

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    await note.deleteOne()
    res.json({ message: 'Note deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const shareNote = async (req, res) => {
  try {
    const noteId = req.params.id
    const { username } = req.body

    // Find the note to share
    const note = await Note.findById(noteId).populate('user')

    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }

    // Find the user to share with
    const userToShareWith = await User.findOne({ username })

    if (!userToShareWith) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the authenticated user is the owner of the note
    if (note.user.id !== req.user.id) {
      return res.status(403).json({ message: 'Permission denied' })
    }

    // Check if the note is already shared with the user
    if (note.sharedWith.includes(userToShareWith.id)) {
      return res
        .status(400)
        .json({ message: 'Note is already shared with this user' })
    }

    // Share the note with the user
    note.sharedWith.push(userToShareWith.id)
    await note.save()

    res.status(200).json({ message: 'Note shared successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
}
