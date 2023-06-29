const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const models = require('../models');
const app = require('../app');
const bulkInsertAdmin = require('../helpers/bulkInsertAdmin');
const { signToken, verifyToken } = require('../helpers/jwt');

let access_token

beforeAll(async function () {
  await bulkInsertAdmin()
  access_token = signToken({
    id: 1,
    email: "john.doe@example.com"
  })
})

afterAll(async function () {
  await models.sequelize.close()
})

describe('register Account Administrator', function () {
  test('POST/admin/register(201)', async function () {
    const response = await request(app).post('/admin/register').send({
      mitraName: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "admin",
      balance: 5000,
      status: "active",
      lat: "37.7749",
      lang: "-122.4194"
    })
    console.log(response.body, "<<<body");
    expect(response.status).toEqual(201)
    expect((response) => {
      response.body.data.length = 10;
      expect(response.body).toHaveProperty('id', expect.any(Number))
      response.body.data[1].mitraName = "John Doe";
      response.body.data[2].email = "john.doe@example.com";
      response.body.data[4].role = "admin";
      response.body.data[5].balance = 5000;
      response.body.data[6].status = "active";
    })
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Email is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Password is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
      mitraName: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "",
      balance: 5000,
      status: "active",
      lat: "37.7749",
      lang: "-122.4194"
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("msg", "Role is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Role is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
      mitraName: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      role: "admin",
      balance,
      status: "active",
      lat: "37.7749",
      lang: "-122.4194"
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("msg", "Balance is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Status is required")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Email must be unique")
  })
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app).post('/admin/register').send({
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
    expect(response.body).toHaveProperty("msg", "Invalid email format")
  })
})

describe('Login Administrator', function () {
  test('POST/admin/login', async function () {
    const response = await request(app).post('/admin/login').send
      ({
        email: "john.doe@example.com",
        password: "password123",
      })
    console.log(response.body, "ini login");
    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty(access_token)
  })
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "john.doe@example.com",
      password: ""
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("msg", "Password is required")
  })
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "",
      password: "password123",
    })
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("msg", "Email is required")
  })
  test('failed POST/admin/login(401)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: "john.doe@example.com",
      password: "password12345",
    })
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty("msg", "Invalid email/password")
  })
})

