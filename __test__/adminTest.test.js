const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const models = require('../models');
const app = require('../app');
const bulkInsertAdmin = require('../helpers/bulkInsertAdmin');
const { signToken, verifyToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');
let access_token

beforeAll(async function () {
  await bulkInsertAdmin()
  access_token = signToken({
    id: 1,
    email: "john.doe@example.com",
    password: "password123"

  })
})

afterAll(async function () {
  await models.sequelize.close()
})

describe('register Account Administrator', function () {
  test('POST/admin/register(201)', async function () {
    const response = await request(app).post('/admin/register').set("access_token", access_token).send({
      mitraName: "Adel Doe",
      email: "adel.doe@example.com",
      password: "password123",
      role: "admin",
      balance: 5000,
      status: "active",
      lat: "37.7749",
      lang: "-122.4194"
    })
    
    expect(response.status).toEqual(201)
    expect((response) => {
      expect(response.body).toHaveProperty('id', expect.any(Number))
    })
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "",
        password: "password123",
        role: "admin",
        balance: 5000,
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Email is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doe@example.com",
        password: "",
        role: "admin",
        balance: 5000,
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Password is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "admin",
        balance: 5000,
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Email must be unique")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "admin",
        balance: "",
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Balance is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "admin",
        balance: 5000,
        status: "",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Status is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
        role: "admin",
        balance: 5000,
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Email must be unique")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/register')
      .set("access_token", access_token)
      .send({
        mitraName: "John Doe",
        email: "john.doeexample.com",
        password: "password123",
        role: "admin",
        balance: 5000,
        status: "active",
        lat: "37.7749",
        lang: "-122.4194"
      })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Invalid email format")
  })
})

describe('login Administrator', function () {
  test('POST/admin/login', async function () {
    const response = await request(app).post('/admin/login').send
      ({
        email: "john.doe@example.com",
        password: "password123",
      })
    console.log(response.body, "ini login");
    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty("access_token")
  })
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "john.doe@example.com",
      password: ""
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Password is required")
  })
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "",
      password: "password123",
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("message", "Email is required")
  })
  test('failed POST/admin/login(401)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "john.dose@example.com",
      password: "password123",
    })
    expect(response.status).toEqual(401);
    console.log(response.body, 'bodyyyyyyy ');
    expect(response.body).toHaveProperty("message", "Invalid email/password")
  })
  test('failed POST/admin/login(401)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "john.doe@example.com",
      password: "password12345ddd",
    })
    expect(response.status).toEqual(401);
    console.log(response.body, 'bodyyyyyyy ');
    expect(response.body).toHaveProperty("message", "Invalid email/password")
  })
})

describe('read All Services', function () {
  test('GET/admin/services', async function () {
    const response = (await request(app).get('/admin/services').set("access_token", access_token))
    expect(response.status).toEqual(200)
  })
  test('failed GET/admin/services', async function () {
    const response = (await request(app).post('/admin/services').set("access_token", ''))
    expect(response.status).toEqual(401)
    expect(response.body).toHaveProperty("message", 'Invalid token')
  })
})

describe('read All Mitra', function () {
  test('GET/admin/mitra', async function () {
    const response = (await request(app).post('/admin/mitra').set("access_token", access_token))
    expect(response.status).toEqual(200)
  })
  test('failed GET/admin/mitra', async function () {
    const response = (await request(app).post('/admin/mitra').set("access_token", '2JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJtdXNhbmdAZ21haWwuY29tIiwiaWF0IjoxNjg1NzAwMDI2fQ.jErs6GoPMYq_tdCjHZlOUjxU9nNePwEwRuU8M53tCQA'))
    expect(response.status).toEqual(401)
    expect(response.body).toHaveProperty("message", 'Invalid token ')
  })
})

describe('read All Total Revenues', function () {
  test('GET/admin/mitra', async function () {
    const response = (await request(app).post('/admin/revenues').set("access_token", access_token))
    expect(response.status).toEqual(200)
  })
  test('failed GET/admin/mitra', async function () {
    const response = (await request(app).post('/admin/revenues').set("access_token", '2JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJtdXNhbmdAZ21haWwuY29tIiwiaWF0IjoxNjg1NzAwMDI2fQ.jErs6GoPMYq_tdCjHZlOUjxU9nNePwEwRuU8M53tCQA'))
    expect(response.status).toEqual(401)
    expect(response.body).toHaveProperty("message", 'Invalid token ')
  })
})





