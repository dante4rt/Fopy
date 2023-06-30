require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/index')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use(router)

module.exports = app;