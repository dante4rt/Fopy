const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')
const { Administrator } = require('../models')

class driverController {
    static async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email) {
                throw { name: 'EMAIL_REQUIRED' }
            }
            if (!password) {
                throw { name: 'PASSWORD_REQUIRED' }
            }
    
            const driver = await Administrator.findOne({
                where: {
                    email
                }
            })
    
    
            if (!driver) {
                throw { name: 'INVALID_DATA' }
            }
            
            const isValidPassword = comparePassword(password, driver.password)
            
            if (!isValidPassword) {
                throw { name: 'INVALID_DATA' }
            }
    
            const access_token = generateToken({
                id: driver.id,
                email: driver.email
                // username: driver.username,
            })
    
            res.json({
                id: driver.id,
                email: driver.email,
                access_token: access_token,
                // username: driver.username,
                // role: driver.role
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }
}

module.exports = driverController