require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(router)

module.exports = app;