const { describe, test, expect } = require('@jest/globals')
const request = require('supertest')
const { sequelize } = require('../models')
const fs = require('fs')
const app = require('../app')
const bcrypt = require('bcryptjs')
const { signToken } = require('../helpers/jwt')
let access_token;

beforeAll(async () => {
    // User
    let dataUsers = JSON.parse(fs.readFileSync("./database/user.json", "utf-8")).map((el) => {
        el.password = bcrypt.hashSync(el.password)
        el.createdAt = new Date()
        el.updatedAt = new Date()
        delete el.id 
        return el 
    })

    await sequelize.queryInterface.bulkInsert('Users', dataUsers)

    // Admin
    let dataAdmin = JSON.parse(fs.readFileSync("./database/administrator.json", "utf-8")).map((el) => {
        el.createdAt = new Date()
        el.updatedAt = new Date()
        el.location = sequelize.fn(
            'ST_GeomFromText',
            el.location
        );
        delete el.lat;
        delete el.lang;
        delete el.id 
        return el 
    })

    await sequelize.queryInterface.bulkInsert('Administrators', dataAdmin)
    
    // Service 
    let dataService = JSON.parse(fs.readFileSync("./database/service.json", "utf-8")).map((el) => {
        el.createdAt = new Date()
        el.updatedAt = new Date()
        delete el.id 
        return el
    })

    await sequelize.queryInterface.bulkInsert('Services', dataService)

    access_token = signToken({
        email: "alex01@example.com",
        password: "securepass123",
        balance: 2500000
    })
})

afterAll(async () => {
    // User
    await sequelize.queryInterface.bulkDelete('Users', null, {
        cascade: true,
        truncate: true,
        restartIdentity: true,
    })

    // Admin
    await sequelize.queryInterface.bulkDelete('Administrators', null, {
        cascade: true,
        truncate: true,
        restartIdentity: true,
    })

    // Service 
    await sequelize.queryInterface.bulkDelete('Services', null, {
        cascade: true,
        truncate: true,
        restartIdentity: true,
    })
})

describe('Divisi User Test', () => {
    /* (Create) Section */

    // User membuat akunnya (Registrasi)
    describe("POST /user/register", () => {
        test("Perform successful register new User", async () => {
            const userDummy = {
                username: "alexY",
                email: "alexYII@example.com",
                password: "securepass1234",
                balance: 2500,
                imgUrl: "https://example.com/images/alexyii.jpg"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(201)
        })

        test("POST /user/register if something wrong with server (wrong input type)", async () => {
            const userDummy = {
                username: 123123, 
                email: 123123, 
                password: 123123, 
                balance: 35000, 
                imgUrl: "http://image.url.com"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(500)
        })

        test("POST /register if username doesn't inputed", async () => {
            const userDummy = {
                email: "adawong@mail.com", 
                password: "john", 
                balance: 35000, 
                imgUrl: "http://image.url.com",
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /register if email doesn't inputed", async () => {
            const userDummy = {
                username: "adawong", 
                password: "john", 
                balance: 35000, 
                imgUrl: "http://image.url.com"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /register if password doesn't inputed", async () => {
            const userDummy = {
                username: "adawong", 
                email: "adawong@mail.com",
                balance: 35000, 
                imgUrl: "http://image.url.com"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(400)
        })
    })

    // User melakukan login
    describe("POST /user/login", () => {
        test("Perform successful User login ", async () => {
            const userDummy = {
                email: "alex01@example.com",
                password: "securepass123",
            }
            const response = await request(app).post("/user/login").send(userDummy)
            // accessToken = response.body.accessToken; // Store the access token
            expect(response.body).toHaveProperty('accessToken');
            expect(response.status).toBe(200)
        })

        test("POST /user/login if email and password doesn't match up", async () => {
            const userDummy = {
                email: "alex01@example.com",
                password: "Hello world",
            }
            const response = await request(app).post("/user/login").send(userDummy)
            expect(response.status).toBe(401)
        })

        test("POST /user/login if email doesn't inputed", async () => {
            const userDummy = {
                password: "securepass123",
            }
            const response = await request(app).post("/user/login").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /user/login if password doesn't inputed", async () => {
            const userDummy = {
                email: "alex01@example.com",
            }
            const response = await request(app).post("/user/login").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /user/login if email doesn't registered in database", async () => {
            const userDummy = {
                email: "postal@example.com",
                password: "postal",
            }
            const response = await request(app).post("/user/login").send(userDummy)
            expect(response.status).toBe(404)
        })

        test("POST /user/login if something wrong with server (wrong input type)", async () => {
            const userDummy = {
                email: 231321,
                password: 12312
            }
            const response = await request(app).post("/user/login").send(userDummy)
            expect(response.status).toBe(500)
        })
    })

    // User melakukan update profile mereka
    describe("PUT /user/editUser", () => {
        test("User berhasil mengedit data mereka", async () => {
            const userDummy = {
                username: "Alaygaksih",
                email: "alex01@example.com",
                password: "securepass123",
                balance: 2500000,
                imgUrl: "https://example.com/images/alex01.jpg"
            }

            const response = await request(app)
            .put("/user/editUser")
            .set("access_token", access_token)
            .send(userDummy);
            expect(response.status).toBe(201)
        })

        test("PUT /user/editUser", async () => {
            const userDummy = {
                email: "alex01@example.com",
                password: "securepass123",
                balance: 2500,
                imgUrl: "https://example.com/images/alex01.jpg"
            }

            const response = await request(app)
            .put("/user/editUser")
            .set("access_token", access_token)
            .send(userDummy)
            expect(response.status).toBe(400)
        })

        test("PUT /user/editUser", async () => {
            const userDummy = {
                username: "Alaygaksih",
                password: "securepass123",
                balance: 2500000,
                imgUrl: "https://example.com/images/alex01.jpg"
            }

            const response = await request(app)
            .put("/user/editUser")
            .set("access_token", access_token)
            .send(userDummy)
            expect(response.status).toBe(400)
        })

        test("PUT /user/editUser", async () => {
            const userDummy = {
                username: "Alaygaksih",
                email: "alex01@example.com",
                balance: 2500000,
                imgUrl: "https://example.com/images/alex01.jpg"
            }

            const response = await request(app)
            .put("/user/editUser")
            .set("access_token", access_token)
            .send(userDummy)
            expect(response.status).toBe(400)
        })

        test("PUT /user/editUser", async () => {
            const userDummy = {
                username: "Alaygaksih",
                email: "alex01@example.com",
                password: "securepass123",
                balance: 2500000,
            }

            const response = await request(app)
            .put("/user/editUser")
            .set("access_token", access_token)
            .send(userDummy)
            expect(response.status).toBe(400)
        })
    })

    // User membuat orderan baru (Tabel Order)
    describe("POST /user/newOrder", () => {
        test("User berhasil membuat orderan baru", async () => {
            const order = { 
                        AdministratorId: 1,
                        totalPrice: 200,
                        location: "POINT(107.59278847659893 -6.942981263106864)",
                        deliveryMethod: "Delivery",
                        totalPrice: 15000
            }

            const products = 
                [
                    {
                      ServiceId: 1,
                      quantity: 2,
                      totalPage: 8,
                      url: "http://image.com"
                    },
                    {
                      ServiceId: 2,
                      quantity: 5,
                      totalPage: 10,
                      url: "http://image.com"
                    }
                  ]

            const response = await request(app)
            .post("/user/newOrder")
            .set('access_token', access_token) // Set the access token in headers
            .send({order, products});
            console.log(response, "<<<<<< ini response test")
            expect(response.status).toBe(201)
        })
    })

    // User membuat orderan baru (Tabel OrderDetails)
    // describe("POST /user/addOrder", () => {
    //     test("User berhasil membuat orderan baru", async () => {
    //         const orderDummy = {
    //             ServiceId: 1,
    //             OrderId: 1,
    //             quantity: 2,
    //             totalPage: 8,
    //             url: "http://image.com"
    //         }
    //         const response = await request(app).post("/user/addOrder").send(orderDummy)
    //         expect(response.status).toBe(201)
    //     })
    // })

    // Get atau membaca orderan yang dibuat oleh user 
    describe("GET /user/getOrder", () => {
        test("User membaca semua orderan yang dia buat", async () => {
            const response = await request(app)
            .get("/user/getOrder")
            .set('access_token', access_token)
    
            expect(response.status).toBe(200)
        })
    })
})
