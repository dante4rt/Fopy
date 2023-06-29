const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const { Administrator, Order } = require('../models');
const jwt = require('jsonwebtoken');
const app = require('../app');
const SECRET = 'Bismillah';

let validToken, validToken2, invalidToken;
const userTest1 = {
  email: 'user.test1@mail.com',
  password: 'usertest1',
  role: 'driver',
  //     balance: 5000,
  //     status: 'active',
};

const userTest2 = {
  email: 'user.test2@mail.com',
  password: 'usertest2',
  role: 'driver',
  //   balance: 5000,
  //   status: 'active',
};

beforeAll(async function () {
  try {
    await Administrator.create({
      email: 'user.test1@mail.com',
      password: 'usertest1',
      role: 'driver',
      balance: 5000,
      status: 'active',
    });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async function () {
  await Administrator.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  })
    .then((_) => {
      return Order.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    })
    .then((_) => {
      done();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe('Driver Test', () => {
  describe('POST /login - driver login', () => {
    test('POST /login success', async function () {
      const response = await request(app).post('/driver/login').send({
        email: 'user.test1@mail.com',
        password: 'usertest1',
      });

      expect(response.status).toEqual(200);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('email');

      expect(typeof response.body.access_token).toEqual('string');
      expect(typeof response.body.email).toEqual('string');
      ACCESS_TOKEN = response.body.access_token;
    });

    test('POST /login failed with wrong password', async function () {
      const response = await request(app)
        .post('/public/login')
        .send({ email: 'hacktiv8@mail.com', password: 'xxx' });

      expect(response.status).toEqual(401);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');

      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Invalid email or password');
    });

    test('POST /login failed with email that is not on the database', async function () {
      const response = await request(app)
        .post('/public/login')
        .send({ email: 'hacktiv8@mail.comx', password: '12345' });

      expect(response.status).toEqual(401);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');

      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Invalid email or password');
    });
  });

  describe('POST /add - create new driver', () => {
    test('201 Success register - should create new Driver', (done) => {
      request(app)
        .post('/add')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('email', user1.email);
          return done();
        });
    });

    test('POST /add failed no email', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ password: '12345' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Your email cannot be null');
    });

    test('POST /add failed no password', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ email: 'sepatu@mail.com' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Your password cannot be null');
    });

    test('POST /add email with empty string', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ email: '', password: '12345' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Your email cannot be empty');
    });

    test('POST /add password with empty string', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ email: 'sepatu@mail.com', password: '' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Your password cannot be empty');
    });

    test('POST /add using same email', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ email: 'hacktiv8@mail.com', password: '12345' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual('Your email has been used');
    });

    test('POST /add invalid email format', async function () {
      const response = await request(app)
        .post('/public/add')
        .send({ email: 'sepatumail.com', password: '12345' });

      expect(response.status).toEqual(400);
      expect(typeof response.body).toEqual('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toEqual('string');
      expect(response.body.message).toEqual(
        'You must using an email format, using @'
      );
    });
  });

  describe('GET /orders', () => {
    test('200 success get orders', (done) => {
      request(app)
        .get('/heroes')
        .set('access_token', validToken)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          expect(body.length).toBeGreaterThan(0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('401 get orders with invalid token', (done) => {
      request(app)
        .get('/heroes')
        .set('access_token', invalidToken)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid token');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('401 get orders without token', (done) => {
      request(app)
        .get('/heroes')
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid token');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('UPDATE /orders/:id', () => {
    test('200 success update selected orders', (done) => {
      request(app)
        .patch(`/myheroes/${idMyHero}`)
        .set('access_token', validToken)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(200);
          expect(body).toHaveProperty('message', 'Hero has been played');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('403 update selected orders with unauthorized user', (done) => {
      request(app)
        .patch(`/myheroes/${idMyHero}`)
        .set('access_token', validToken2)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(403);
          expect(body).toHaveProperty('message', 'You are not authorized');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('401 update selected orders with invalid token', (done) => {
      request(app)
        .patch(`/myheroes/${idMyHero}`)
        .set('access_token', invalidToken)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid token');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('401 update selected orders without token', (done) => {
      request(app)
        .patch(`/myheroes/${idMyHero}`)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid token');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('404 update selected orders not found', (done) => {
      request(app)
        .patch(`/myheroes/99`)
        .set('access_token', validToken)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(404);
          expect(body).toHaveProperty('message', 'Hero not found');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
