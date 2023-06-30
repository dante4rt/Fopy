const {verifyToken} = require('../helpers/jwt')
const {User} = require('../models')

const authentication = async (req, res) => {
    try {
        // bawa kartu id gak lu ?
        const {access_token} = req.headers
        
        if (!access_token) {
            res.status(401).json({message: "Invalid Token"})
        }

        // ini token asli gak ?
        const userId = verifyToken(access_token)

        // cek apakah pemilik kartu id ini masih terdaftar di server atau tidak 
        const user = await User.findOne({where: {email: userId.email}})

        if (!user) {
            res.status(401).json({message: "Invalid Token"})
        }

        req.user = user 

        // bisa masuk
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = {authentication}