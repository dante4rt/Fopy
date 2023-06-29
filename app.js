require('dotenv').config()
// console.log(process.env)
const express = require('express')
const app = express()

const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app;