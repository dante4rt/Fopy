require('dotenv').config()
// console.log(process.env)
const express = require('express')
const app = express()

const cors = require('cors')
const router = require('./router')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(router)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;