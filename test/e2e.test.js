const request = require('supertest')
const server = require('../index')
const mongoose = require('mongoose')

const generateTestToken = async () => {
  await request(server).post('/auth/register').send({
    username: 'test123',
    password: 'test123',
  })

  const { body } = await request(server).post('/auth/login').send({
    username: 'test123',
    password: 'test123',
  })

  return body.token
}

let authToken // Store the authentication token for later use
beforeAll(async () => {
  authToken = await generateTestToken()
})

describe('End-to-End Tests', () => {
  // Test note creation
  it('should create a new note', async () => {
    const response = await request(server)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Note',
        body: 'This is a test note.',
      })

    expect(response.status).toBe(200)
  })

  // Test getting all notes
  it('should get all notes', async () => {
    const response = await request(server)
      .get('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  // Test getting a specific note
  it('should get a specific note', async () => {
    const {
      body: { _id: noteID },
    } = await request(server)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Note',
        body: 'This is a test note.',
      })

    const response = await request(server)
      .get(`/api/notes/${noteID}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('title')
    expect(response.body).toHaveProperty('body')
  })

  // Test updating a specific note
  it('should update a specific note', async () => {
    const {
      body: { _id: noteID },
    } = await request(server)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Note',
        body: 'This is a test note.',
      })
    const response = await request(server)
      .put(`/api/notes/${noteID}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Updated Test Note',
        body: 'This is an updated test note.',
      })

    expect(response.status).toBe(200)
  })

  // Test deleting a specific note
  it('should delete a specific note', async () => {
    const {
      body: { _id: noteID },
    } = await request(server)
      .post('/api/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Note',
        body: 'This is a test note.',
      })

    const response = await request(server)
      .delete(`/api/notes/${noteID}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
  })
})

afterAll(async () => {
  // Close the server or perform cleanup after all tests
  await mongoose.disconnect()
  server.close()
})
