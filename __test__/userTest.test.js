const { describe, test, expect } = require('@jest/globals')
const request = require('supertest')
const { sequelize } = require('../models')
const fs = require('fs')
const app = require('../app')
const bcrypt = require('bcryptjs')

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
                imgUrl: "http://image.url.com", 
                lat: "012321482", 
                lang: "02131,43423"
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
                lat: "012321482", 
                lang: "02131,43423"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /register if email doesn't inputed", async () => {
            const userDummy = {
                username: "adawong", 
                password: "john", 
                balance: 35000, 
                imgUrl: "http://image.url.com", 
                lat: "012321482", 
                lang: "02131,43423"
            }
            const response = await request(app).post("/user/register").send(userDummy)
            expect(response.status).toBe(400)
        })

        test("POST /register if password doesn't inputed", async () => {
            const userDummy = {
                username: "adawong", 
                email: "adawong@mail.com",
                balance: 35000, 
                imgUrl: "http://image.url.com", 
                lat: "012321482", 
                lang: "02131,43423"
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
})
