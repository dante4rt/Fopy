const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const { sequelize, Administrator, User, Service } = require('../models');
const fs = require('fs');
const app = require('../app');
const bcrypt = require('bcryptjs');
const { signToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
let access_token;

beforeAll(async () => {
  // User
  try {
    let dataUsers = JSON.parse(
      fs.readFileSync('./database/user.json', 'utf-8')
    ).map((el) => {
      el.password = hashPassword(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
      delete el.id;
      return el;
    });

    await sequelize.queryInterface.bulkInsert('Users', dataUsers).then(() => {
      access_token = signToken({
        email: 'alex01@example.com',
        password: 'securepass123',
        balance: 2500000,
      });
    });

    // Admin
    let dataAdmin = JSON.parse(
      fs.readFileSync('./database/administrator.json', 'utf-8')
    ).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.location = sequelize.fn('ST_GeomFromText', el.location);
      delete el.lat;
      delete el.lang;
      delete el.id;
      return el;
    });

    await sequelize.queryInterface.bulkInsert('Administrators', dataAdmin);

    // Service
    let dataService = JSON.parse(
      fs.readFileSync('./database/service.json', 'utf-8')
    ).map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      delete el.id;
      return el;
    });

    await sequelize.queryInterface.bulkInsert('Services', dataService);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Service.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  })
    .then(async (_) => {
      await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });

      await Administrator.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });

      return;
    })
    .catch((error) => {
      console.log(error);
    });
});

describe('Divisi User Test', () => {
  /* (Create) Section */

  // User membuat akunnya (Registrasi)
  describe('POST /user/register', () => {
    test('Perform successful register new User', async () => {
      const userDummy = {
        username: 'alexY',
        email: 'alexYII@example.com',
        password: 'securepass1234',
        balance: 2500,
        imgUrl: 'https://example.com/images/alexyii.jpg',
      };
      const response = await request(app)
        .post('/user/register')
        .send(userDummy);
      expect(response.status).toBe(201);
    });

    test('POST /user/register if something wrong with server (wrong input type)', async () => {
      const userDummy = {
        username: 123123,
        email: 123123,
        password: 123123,
        balance: 35000,
        imgUrl: 'http://image.url.com',
      };
      const response = await request(app)
        .post('/user/register')
        .send(userDummy);
      expect(response.status).toBe(500);
    });

    test("POST /register if username doesn't inputed", async () => {
      const userDummy = {
        email: 'adawong@mail.com',
        password: 'john',
        balance: 35000,
        imgUrl: 'http://image.url.com',
      };
      const response = await request(app)
        .post('/user/register')
        .send(userDummy);
      expect(response.status).toBe(400);
    });

    test("POST /register if email doesn't inputed", async () => {
      const userDummy = {
        username: 'adawong',
        password: 'john',
        balance: 35000,
        imgUrl: 'http://image.url.com',
      };
      const response = await request(app)
        .post('/user/register')
        .send(userDummy);
      expect(response.status).toBe(400);
    });

    test("POST /register if password doesn't inputed", async () => {
      const userDummy = {
        username: 'adawong',
        email: 'adawong@mail.com',
        balance: 35000,
        imgUrl: 'http://image.url.com',
      };
      const response = await request(app)
        .post('/user/register')
        .send(userDummy);
      expect(response.status).toBe(400);
    });
  });

  // User melakukan login
  describe('POST /user/login', () => {
    beforeAll(async () => {
      await User.create({
        email: 'alex011@example.com',
        password: 'securepass1231',
      });
    });
    test('Perform successful User login ', async () => {
      const userDummy = {
        email: 'alex011@example.com',
        password: 'securepass1231',
      };
      const response = await request(app).post('/user/login').send(userDummy);

      expect(response.body).toHaveProperty('access_token');
      expect(response.status).toBe(200);
    });

    test("POST /user/login if email and password doesn't match up", async () => {
      const userDummy = {
        email: 'alex01@example.com',
        password: 'Hello world',
      };
      const response = await request(app).post('/user/login').send(userDummy);
      expect(response.status).toBe(401);
    });

    test("POST /user/login if email doesn't inputed", async () => {
      const userDummy = {
        password: 'securepass123',
      };
      const response = await request(app).post('/user/login').send(userDummy);
      expect(response.status).toBe(400);
    });

    test("POST /user/login if password doesn't inputed", async () => {
      const userDummy = {
        email: 'alex01@example.com',
      };
      const response = await request(app).post('/user/login').send(userDummy);
      expect(response.status).toBe(400);
    });

    test("POST /user/login if email doesn't registered in database", async () => {
      const userDummy = {
        email: 'postal@example.com',
        password: 'postal',
      };
      const response = await request(app).post('/user/login').send(userDummy);
      expect(response.status).toBe(404);
    });

    test('POST /user/login if something wrong with server (wrong input type)', async () => {
      const userDummy = {
        email: 231321,
        password: 12312,
      };
      const response = await request(app).post('/user/login').send(userDummy);
      expect(response.status).toBe(500);
    });
  });

  // User melakukan update profile mereka
  describe('PUT /user/editUser', () => {
    test('User berhasil mengedit data mereka', async () => {
      const userDummy = {
        username: 'Alaygaksih',
        email: 'alex01@example.com',
        password: 'securepass123',
        balance: 2500000,
        imgUrl: 'https://example.com/images/alex01.jpg',
      };

      const response = await request(app)
        .put('/user/editUser')
        .set('access_token', access_token)
        .send(userDummy);
      expect(response.status).toBe(201);
    });

    test('PUT /user/editUser', async () => {
      const userDummy = {
        email: 'alex01@example.com',
        password: 'securepass123',
        balance: 2500,
        imgUrl: 'https://example.com/images/alex01.jpg',
      };

      const response = await request(app)
        .put('/user/editUser')
        .set('access_token', access_token)
        .send(userDummy);
      expect(response.status).toBe(400);
    });

    test('PUT /user/editUser', async () => {
      const userDummy = {
        username: 'Alaygaksih',
        password: 'securepass123',
        balance: 2500000,
        imgUrl: 'https://example.com/images/alex01.jpg',
      };

      const response = await request(app)
        .put('/user/editUser')
        .set('access_token', access_token)
        .send(userDummy);
      expect(response.status).toBe(400);
    });

    test('PUT /user/editUser', async () => {
      const userDummy = {
        username: 'Alaygaksih',
        email: 'alex01@example.com',
        balance: 2500000,
        imgUrl: 'https://example.com/images/alex01.jpg',
      };

      const response = await request(app)
        .put('/user/editUser')
        .set('access_token', access_token)
        .send(userDummy);
      expect(response.status).toBe(400);
    });

    test('PUT /user/editUser', async () => {
      const userDummy = {
        username: 'Alaygaksih',
        email: 'alex01@example.com',
        password: 'securepass123',
        balance: 2500000,
      };

      const response = await request(app)
        .put('/user/editUser')
        .set('access_token', access_token)
        .send(userDummy);
      expect(response.status).toBe(400);
    });
  });

  // User membuat orderan baru (Tabel Order)
  describe('POST /user/newOrder', () => {
    test('User berhasil membuat orderan baru', async () => {
      const order = {
        AdministratorId: 1,
        totalPrice: 200,
        location: 'POINT(107.59278847659893 -6.942981263106864)',
        deliveryMethod: 'Delivery',
        totalPrice: 15000,
      };

      const products = [
        {
          ServiceId: 1,
          quantity: 2,
          totalPage: 8,
          url: 'http://image.com',
        },
        {
          ServiceId: 2,
          quantity: 5,
          totalPage: 10,
          url: 'http://image.com',
        },
      ];

      const response = await request(app)
        .post('/user/newOrder')
        .set('access_token', access_token) // Set the access token in headers
        .send({ order, products });

      expect(response.status).toBe(201);
    });

    test('User failed to add new order because insufficient balance', async () => {
      const order = {
        AdministratorId: 1,
        location: 'POINT(107.59278847659893 -6.942981263106864)',
        deliveryMethod: 'Delivery',
        totalPrice: 15000000,
      };

      const products = [
        {
          ServiceId: 1,
          quantity: 2,
          totalPage: 8,
          url: 'http://image.com',
        },
        {
          ServiceId: 2,
          quantity: 5,
          totalPage: 10,
          url: 'http://image.com',
        },
      ];

      const response = await request(app)
        .post('/user/newOrder')
        .set(
          'access_token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJzYXJhODdAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InNhcmE4NyIsImlhdCI6MTY4ODQwMjIyNn0.kuOPW9u-2k86yf0_x0AFGHe1f8oD2SXnMRAHK3vbx7s'
        ) // Set the access token in headers
        .send({ order, products });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');

      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Insufficient balance!');
    });
  });

  // Get atau membaca orderan yang dibuat oleh user
  describe('GET /user/getOrder', () => {
    test('User membaca semua orderan yang dia buat', async () => {
      const response = await request(app)
        .get('/user/getOrder')
        .set('access_token', access_token);

      expect(response.status).toBe(200);
    });

    test('Get user orders failed because token invalid', async () => {
      const response = await request(app).get('/user/getOrder');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');

      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Invalid Token');
    });

    test('Get user orders failed because email is not registered on db', async () => {
      const response = await request(app)
        .get('/user/getOrder')
        .set(
          'access_token',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJkYXZpZC5qb2huc29uQGV4YW1wbGUuY29tIiwiaWF0IjoxNjg4MzcwMjUzfQ.mULz17rNpUe0J70RPeFddaAhXKbwIzQaVsXp8SYAFVQ'
        );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');

      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Invalid Token');
    });
  });

  describe('POST /midtrans', () => {
    test('POST /midtrans success', async () => {
      const response = await request(app)
        .post('/user/midtrans')
        .set('access_token', access_token)
        .send({ amount: 1000 });

      console.log(response, `woiii`);

      expect(response.status).toEqual(201);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('token', expect.any(String));
      expect(response.body).toHaveProperty('redirect_url', expect.any(String));
    });

    test('POST /midtrans failed because amount is empty', async () => {
      const response = await request(app)
        .post('/user/midtrans')
        .set('access_token', access_token)
        .send({ amount: '' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message', expect.any(String));
      expect(response.body.message).toEqual('Amount cannot be empty');
    });
  });

  describe('POST /midtrans/check', () => {
    test('POST /midtrans/check success', async () => {
      const response = await request(app)
        .post('/user/midtrans/check')
        .set('access_token', access_token)
        .send({
          channel_response_message: 'Approved',
          gross_amount: 10000,
          order_id: 'FOPY_TX_1',
        });

      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message', expect.any(String));
      expect(response.body.message).toEqual('Balance updated!');
    });

    test('POST /midtrans/check failed because body is empty', async () => {
      const response = await request(app)
        .post('/user/midtrans/check')
        .set('access_token', access_token)

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message', expect.any(String));
      expect(response.body.message).toEqual('Data must be filled!');
    });

    test('POST /midtrans/check failed because payment failed', async () => {
      const response = await request(app)
        .post('/user/midtrans/check')
        .set('access_token', access_token)
        .send({
          channel_response_message: 'Approved', 
          gross_amount: 10000, 
          order_id: 'FOPY_TX_111111'
        })

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message', expect.any(String));
      expect(response.body.message).toEqual('Payment failed!');
    });
  });
});
