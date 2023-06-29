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
  }),
    access_token = signToken({
      id: 2,
      email: "jane.smith@example.com"
    }),
    access_token = signToken({
      id: 3,
      email: "david.johnson@example.com"
    })
})

afterAll(async function () {
  await models.sequelize.close()
})
