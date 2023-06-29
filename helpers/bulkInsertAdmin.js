const { Administrator } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
//restart id from 1
async function bulkInsertAdmin() {
  try {
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
      {
        "mitraName": "Jane Smith",
        "email": "jane.smith@example.com",
        "password": hashPassword("password456"),
        "role": "mitra",
        "balance": 3000,
        "status": "active",
        "lat": "40.7128",
        "lang": "-74.0060"
      },
      {
        "mitraName": "David Johnson",
        "email": "david.johnson@example.com",
        "password": hashPassword("password789"),
        "role": "driver",
        "balance": 1000,
        "status": "active",
        "lat": "51.5074",
        "lang": "-0.1278"
      }
    ])
  } catch (error) {
    console.log(error, "error di insert admin")
  }
}

module.exports = bulkInsertAdmin