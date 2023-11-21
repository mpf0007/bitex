const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/user')
const config = require('../../config/config')

const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, password } = req.body

  try {
    let user = await User.findOne({ username })

    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    user = new User({ username, password })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id,
        username: username,
      },
    }
    console.log('=============================================================')
    console.log(payload)
    console.log('=============================================================')
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      },
    )
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, password } = req.body

  try {
    let user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = { register, login }
