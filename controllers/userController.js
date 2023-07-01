const { Administrator, Order, OrderService, Service, User } = require('../models')
const bcrypt = require('bcryptjs')
const {signToken} = require('../helpers/jwt')

class userController {
    /*Create Section*/

    // Register
    static async register (req, res) {
        try {
            const {username, email, password, balance, imgUrl} = req.body

            if(!username) {
                res.status(400).json({message: "Username cannot be empty"})
                return;
            }

            if(!email) {
                res.status(400).json({message: "Email cannot be empty"})
                return;
            }

            if(!password) {
                res.status(400).json({message: "Password cannot be empty"})
                return;
            }

            const newUser = await User.create({
                username, 
                email, 
                password, 
                balance, 
                imgUrl
            })

            res.status(201).json({message: `User with username ${newUser.username} has been created`})
        } catch (error) {
            res.status(500).json({message: "Internal Server Error"})
        }
    }

    // Login
    static async login (req, res) {
        try {
            const {email, password} = req.body

            // check apakah ada email ama passwordnya
            if (!email) {
                res.status(400).json({message: "Please enter your email"})
                return;
            } 
            if (!password) {
                res.status(400).json({message: "Please enter your password"})
                return
            }

            // kita cari data yang memiliki email tersebut
            const [user] = await User.findAll({where: {email: email}})

            // check apakah ada data dengan email tersebut
            if (!user) {
                res.status(404).json({message: "Email or Password is incorrect"})
                return;
            }

            // kita lakukan perbandingan antara email dan password yang di masukkan oleh User
            const isPassValid = bcrypt.compareSync(password, user.password)

            // check apakah password yang dimasukkan user sama dengan di database 
            if (!isPassValid) {
                res.status(401).json({message: "Email or Password is incorrect"})
                return;
            }

            // kita hash accessTokennya
            const accessToken = signToken({
                id: user.id,
                email: user.email,
                username: user.username
            })

            // kirim hash ke headers browser
            res.status(200).json({accessToken})

        } catch (error) {
            res.status(500).json({message: "Internal Server Error"})
        }
    }
}

module.exports = userController