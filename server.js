
const app = require('./app')
const cors = require('cors')
const port = process.env.PORT || 3000
app.use(cors())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
