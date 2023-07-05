const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const models = require('../models');
const app = require('../app');
const bulkInsertAdmin = require('../helpers/bulkInsertAdmin');
const { signToken, verifyToken } = require('../helpers/jwt');

let access_token, access_token2, access_token3;
let serviceData = {
  AdministratorId: 2,
  name: 'Naaaah',
  price: 15000,
  description: 'This is a description',
  imgUrl: 'https://via.placeholder.com/800x800',
  type: 'Service',
};

beforeAll(async function () {
  await bulkInsertAdmin();
  access_token = signToken({
    id: 1,
    email: 'john.doe@example.com',
    password: 'password123',
  });

  access_token2 = signToken({
    id: 1,
    email: 'jane.doe@example.com',
    password: 'password123',
  });

  access_token3 = signToken({
    email: 'Jack.doe@example.com',
    password: 'password123',
  });
});

afterAll(async function () {
  await models.sequelize.close();
});

describe('register Account Administrator', function () {
  test('POST/admin/register(201)', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'Adel Doe',
        email: 'adel.doe@example.com',
        password: 'password123',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '37.7749,-122.4194',
      });

    expect(response.status).toEqual(201);
    expect((response) => {
      expect(response.body).toHaveProperty('id', expect.any(Number));
    });
  });
  test('failed POST/admin/register because email is empty', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: '',
        password: 'password123',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '37.7749,-122.4194',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });
  test('failed POST/admin/register(400) because email is empty', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '107.59278847659893,-6.942981263106864',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '37.7749,-122.4194',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Email must be unique');
  });
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'admin',
        balance: '',
        status: 'active',
        location: '37.7749,-122.4194',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Balance is required');
  });
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '37.7749,-122.4194',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Email must be unique');
  });
  test('failed POST/admin/register(400)', async function () {
    const response = await request(app)
      .post('/admin/add/register')
      .set('access_token', access_token)
      .send({
        mitraName: 'John Doe',
        email: 'john.doeexample.com',
        password: 'password123',
        role: 'admin',
        balance: 5000,
        status: 'active',
        location: '37.7749,-122.4194',
      });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Invalid email format');
  });
});

describe('login Administrator', function () {
  test('POST/admin/login', async function () {
    const response = await request(app).post('/admin/login').send({
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('access_token');
  });
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: 'john.doe@example.com',
      password: '',
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });
  test('failed POST/admin/login(400)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: '',
      password: 'password123',
    });
    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });
  test('failed POST/admin/login(401)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: 'john.dose@example.com',
      password: 'password123',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid email/password');
  });
  test('failed POST/admin/login(401)', async function () {
    const response = await request(app).post('/admin/login').send({
      email: 'john.doe@example.com',
      password: 'password12345ddd',
    });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid email/password');
  });
});

describe('read All Services By Admin', function () {
  test('GET/admin/services', async function () {
    const response = await request(app)
      .get('/admin/services')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });

  test('failed GET/admin/services because invalid token', async function () {
    const response = await request(app)
      .post('/admin/services')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('failed GET/admin/services because email not found', async function () {
    const response = await request(app)
      .post('/admin/services')
      .set(
        'access_token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJkYXZpZC5qb2huc29uQGV4YW1wbGUuY29tIiwiaWF0IjoxNjg4MzcwMjUzfQ.mULz17rNpUe0J70RPeFddaAhXKbwIzQaVsXp8SYAFVQ'
      );
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('read All Mitra/Driver', function () {
  test('GET/admin/mitras from admin role', async function () {
    const response = await request(app)
      .get('/admin/mitras')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });

  test('GET/admin/mitras from mitra role', async function () {
    const response = await request(app)
      .get('/admin/mitras')
      .set('access_token', access_token2);
    expect(response.status).toEqual(200);
  });

  test('GET/admin/mitras from driver role', async function () {
    const response = await request(app)
      .get('/admin/mitras')
      .set('access_token', access_token3);

      expect(response.status).toEqual(404);
      expect(response.body).toHaveProperty('message', 'Entity not found!');
  });

  test('failed GET/admin/mitra because invalid token', async function () {
    const response = await request(app)
      .get('/admin/mitras')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('read All Total Balance from Mitra+Driver', function () {
  test('GET/admin/balance success', async function () {
    const response = await request(app)
      .get('/admin/balance')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });
  test('failed GET/admin/balance because token is empty', async function () {
    const response = await request(app)
      .get('/admin/balance')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('update Orders Status By Mitra', function () {
  test('PATCH/orderstatus/:id', async function () {
    const response = await request(app)
      .patch('/admin/orderstatus/1')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });
  test('failed GET/admin/balance', async function () {
    const response = await request(app)
      .patch('/admin/orderstatus/1')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('get Orders By Mitra', function () {
  test('SUCCESS GET/admin/mitraorder', async function () {
    const response = await request(app)
      .get('/admin/mitraorder')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });
  test('failed GET/admin/mitraorder because access token is empty', async function () {
    const response = await request(app)
      .get('/admin/mitraorder')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('read All Services By Mitra', function () {
  test('SUCCESS GET/services/mitra', async function () {
    const response = await request(app)
      .get('/admin/services/mitra')
      .set('access_token', access_token);
    expect(response.status).toEqual(200);
  });
  test('failed GET/services/mitra because invalid token', async function () {
    const response = await request(app)
      .get('/admin/services/mitra')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('add Services', function () {
  test('POST /add/services success', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send(serviceData)
      .set('access_token', access_token);

    expect(response.status).toEqual(201);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('AdministratorId', expect.any(Number));
    expect(response.body).toHaveProperty('name', expect.any(String));
    expect(response.body).toHaveProperty('price', expect.any(Number));
    expect(response.body).toHaveProperty('description', expect.any(String));
    expect(response.body).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body).toHaveProperty('type', expect.any(String));
  });

  test('POST /add/services failed because invalid token', async function () {
    const response = await request(app).post('/admin/add/services').send({
      AdministratorId: 2,
      price: 15000,
      description: 'This is a description',
      imgUrl: 'https://via.placeholder.com/800x800',
      type: 'Service',
    });
    // .set('access_token', access_token);

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('POST /add/services failed because service name is null', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        price: 15000,
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
        type: 'Service',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Service name is required');
  });

  test('POST /add/services failed because price is null', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        name: 'naaah',
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
        type: 'Service',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Price is required');
  });

  test('POST /add/services failed because type is null', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        price: 15000,
        name: 'naaah',
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Type is required');
  });

  test('POST /add/services failed because service name is empty', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        name: '',
        price: 15000,
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
        type: 'Service',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Service name is required');
  });

  test('POST /add/services failed because price is empty', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        name: 'Naaaah',
        price: '',
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
        type: 'Service',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Price is required');
  });

  test('POST /add/services failed because type is empty', async function () {
    const response = await request(app)
      .post('/admin/add/services')
      .send({
        AdministratorId: 2,
        name: 'Naaaah',
        price: 15000,
        description: 'This is a description',
        imgUrl: 'https://via.placeholder.com/800x800',
        type: '',
      })
      .set('access_token', access_token);

    expect(response.status).toEqual(400);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('message');

    expect(typeof response.body.message).toEqual('string');
    expect(response.body.message).toEqual('Type is required');
  });
});

describe('edit Services', function () {
  test('EDIT /admin/editservices/1 success', async function () {
    const response = await request(app)
      .put('/admin/editservices/1')
      .set('access_token', access_token)
      .send(serviceData);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('message', 'Edit services success!');
  });

  test('EDIT /admin/editservices/100 failed because not found', async function () {
    const response = await request(app)
      .put('/admin/editservices/100')
      .set('access_token', access_token)
      .send(serviceData);

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message', 'Entity not found!');
  });

  test('EDIT /admin/editservices/1 failed because no access token', async function () {
    const response = await request(app)
      .put('/admin/editservices/1')
      // .set('access_token', access_token)
      .send(serviceData);

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });
});

describe('delete Mitra/Drivers', function () {
  test('DELETE /delete/mitra/3 success', async function () {
    const response = await request(app)
      .delete('/admin/delete/mitra/3')
      .set('access_token', access_token);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(
      'msg',
      'Mitra with id 3 successfully deleted'
    );
  });

  test('DELETE /delete/mitra/1 failed because invalid token', async function () {
    const response = await request(app).delete('/admin/delete/mitra/1');
    // .set('access_token', access_token);

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('DELETE /delete/mitra/100 failed because entity not found', async function () {
    const response = await request(app)
      .delete('/admin/delete/mitra/100')
      .set('access_token', access_token);

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message', 'Entity not found!');
  });

  test('DELETE /delete/mitra/ failed because not authorized', async function () {
    const response = await request(app)
      .delete('/admin/delete/mitra/2')
      .set('access_token', access_token);

    expect(response.status).toEqual(403);
    expect(response.body).toHaveProperty('message', 'You are not authorized');
  });
});

describe('GET service by id', function() {
  test('SUCCESS GET/services/1', async function () {
    const response = await request(app)
      .get('/admin/services/1')
      .set('access_token', access_token);

    expect(response.status).toEqual(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body).toHaveProperty('id', expect.any(Number));
    expect(response.body).toHaveProperty('AdministratorId', expect.any(Number));
    expect(response.body).toHaveProperty('name', expect.any(String));
    expect(response.body).toHaveProperty('price', expect.any(Number));
    expect(response.body).toHaveProperty('description', expect.any(String));
    expect(response.body).toHaveProperty('imgUrl', expect.any(String));
    expect(response.body).toHaveProperty('type', expect.any(String));

  });
  test('failed GET/services/1 because access token is empty', async function () {
    const response = await request(app)
      .get('/admin/services/1')
      .set('access_token', '');
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  test('failed GET/services/300 because services not found', async function () {
    const response = await request(app)
      .get('/admin/services/190')
      .set('access_token', access_token);
    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message', 'Entity not found!');
  });
})