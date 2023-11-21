const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
})

const Note = mongoose.model('note', noteSchema)

module.exports = Note
