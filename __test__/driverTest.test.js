// const { describe, test, expect } = require('@jest/globals');
// const request = require('supertest');
// const { Administrator, Order, sequelize, User } = require('../models');
// const jwt = require('jsonwebtoken');
// const app = require('../app');
// const SECRET = 'Bismillah';

// let validToken2, invalidToken;

// beforeAll(async function () {
//   try {
//     await Administrator.create({
//       email: 'user.test1@mail.com',
//       password: 'usertest1',
//       role: 'driver',
//       balance: 5000,
//       status: 'active',
//     })
//     .then((registeredUser) => {
//       validToken2 = jwt.sign({
//         id: registeredUser.id,
//         email: registeredUser.email,
//       }, SECRET)})

//       await User.create({
//         email: 'rama@mail.com',
//         password: '12345',
//         balance: 0
//       })

//     await sequelize.queryInterface.bulkInsert('Orders', [
//       {
//         AdministratorId: 1,
//         UserId: 1,
//         totalPrice: 15000,
//         orderStatus: 'Queued',
//         orderDate: '2023-06-30 10:29:14.952 +0700',
//         InvoiceId: 'FOPY-12919129',
//         location: 'xxx xxx',
//         deliveryMethod: 'Delivery'
//       },
//       {
//         AdministratorId: 1,
//         UserId: 1,
//         totalPrice: 2000,
//         orderStatus: 'Queued',
//         orderDate: '2023-06-30 10:29:14.952 +0700',
//         location: 'xxx xxx',
//         deliveryMethod: 'Delivery'
//       }
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// });

// afterAll(async function () {
//   await Administrator.destroy({
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   })
//     .then((_) => {
//       return Order.destroy({
//         truncate: true,
//         cascade: true,
//         restartIdentity: true,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// describe('Driver Test', () => {
//   describe('POST /login - driver login', () => {
//     test('POST /login success', async function () {
//       const response = await request(app).post('/driver/login').send({
//         email: 'user.test1@mail.com',
//         password: 'usertest1',
//       });

//       expect(response.status).toEqual(200);
//       expect(typeof response.body).toEqual('object');
//       expect(response.body).toHaveProperty('access_token');
//       expect(response.body).toHaveProperty('email');

//       expect(typeof response.body.access_token).toEqual('string');
//       expect(typeof response.body.email).toEqual('string');
//     });

//     test('POST /login failed with wrong password', async function () {
//       const response = await request(app)
//         .post('/driver/login')
//         .send({ email: 'user.test1@mail.com', password: 'xxx' });

//       expect(response.status).toEqual(401);
//       expect(typeof response.body).toEqual('object');
//       expect(response.body).toHaveProperty('message');

//       expect(typeof response.body.message).toEqual('string');
//       expect(response.body.message).toEqual('Invalid email or password');
//     });

//     test('POST /login failed because password is empty', async function () {
//       const response = await request(app)
//         .post('/driver/login')
//         .send({ email: 'user.test1@mail.com' });

//       expect(response.status).toEqual(400);
//       expect(typeof response.body).toEqual('object');
//       expect(response.body).toHaveProperty('message');

//       expect(typeof response.body.message).toEqual('string');
//       expect(response.body.message).toEqual('Password is required');
//     });
//     test('POST /login failed because email is empty', async function () {
//       const response = await request(app)
//         .post('/driver/login')
//         .send({ password: '12345' });

//       expect(response.status).toEqual(400);
//       expect(typeof response.body).toEqual('object');
//       expect(response.body).toHaveProperty('message');

//       expect(typeof response.body.message).toEqual('string');
//       expect(response.body.message).toEqual('Email is required');
//     });

//     test('POST /login failed with email that is not on the database', async function () {
//       const response = await request(app)
//         .post('/driver/login')
//         .send({ email: 'hacktiv8@mail.comx', password: '12345' });

//       expect(response.status).toEqual(401);
//       expect(typeof response.body).toEqual('object');
//       expect(response.body).toHaveProperty('message');

//       expect(typeof response.body.message).toEqual('string');
//       expect(response.body.message).toEqual('Invalid email or password');
//     });
//   });

//   describe('GET /orders', () => {
//     test('200 success get orders', async function() {
//       await request(app)
//         .get('/driver/orders')
//         .set('access_token', validToken2)
//         .then((response) => {
//           const { body, status } = response;
//           console.log(response.body, `<<<`);

//           expect(status).toBe(200);
//           expect(Array.isArray(body)).toBeTruthy();
//           expect(body.length).toBeGreaterThan(0);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });

//     test('401 get orders with invalid token', async function() {
//       await request(app)
//         .get('/driver/orders')
//         .set('access_token', invalidToken)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(401);
//           expect(body).toHaveProperty('message', 'Invalid token');
//           done();
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });

//     test('401 get orders without token', async function() {
//       await request(app)
//         .get('/driver/orders')
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(401);
//           expect(body).toHaveProperty('message', 'Invalid token');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });
//   });

//   describe('UPDATE /orders/:id', () => {
//     test('200 success update selected orders', async function() {
//       await request(app)
//         .patch(`/driver/orders/1`)
//         .set('access_token', validToken2)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(200);
//           expect(body).toHaveProperty('message', 'Order status has been updated!');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });

//     test('403 update selected orders with unauthorized user', async function() {
//       await request(app)
//         .patch(`/driver/orders/1`)
//         .set('access_token', validToken2)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(403);
//           expect(body).toHaveProperty('message', 'You are not authorized');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });

//     test('401 update selected orders with invalid token', async function() {
//       await request(app)
//         .patch(`/driver/orders/1`)
//         .set('access_token', invalidToken)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(401);
//           expect(body).toHaveProperty('message', 'Invalid token');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });

//     test('401 update selected orders without token', async function() {
//       await request(app)
//         .patch(`/driver/orders/1`)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(401);
//           expect(body).toHaveProperty('message', 'Invalid token');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });

//     test('404 update selected orders not found', async function() {
//       await request(app)
//         .patch(`/driver/orders/99`)
//         .set('access_token', validToken2)
//         .then((response) => {
//           const { body, status } = response;

//           expect(status).toBe(404);
//           expect(body).toHaveProperty('message', 'Hero not found');
//           done();
//         })
//         .catch((error) => {
//           console.log(error)
//         });
//     });
//   });
// });
