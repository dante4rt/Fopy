const { Administrator } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
//restart id from 1
async function bulkInsertAdmin() {

  await Administrator.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true
  })


  await Administrator.bulkCreate([
    {
      "mitraName": "John Doe",
      "email": "john.doe@example.com",
      "password": hashPassword("password123"),
      "role": "admin",
      "balance": 5000,
      "status": "active",
      "lat": "37.7749",
      "lang": "-122.4194"
    },
  ])

}

module.exports = bulkInsertAdmin