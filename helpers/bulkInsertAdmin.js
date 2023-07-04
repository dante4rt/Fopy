const { Administrator, User, sequelize, Service, Order } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
//restart id from 1
async function bulkInsertAdmin() {
  await Administrator.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Service.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Order.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Administrator.bulkCreate([
    {
      mitraName: 'John Doe',
      email: 'john.doe@example.com',
      password: hashPassword('password123'),
      role: 'admin',
      balance: 5000,
      status: 'active',
      location: sequelize.fn(
        'ST_GeomFromText',
        'POINT(107.5925576773082 -6.940669415817259)'
      ),
      AdministratorId: 1,
    },
    {
      mitraName: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: hashPassword('password123'),
      role: 'mitra',
      balance: 5000,
      status: 'active',
      location: sequelize.fn(
        'ST_GeomFromText',
        'POINT(107.5925576773082 -6.940669415817259)'
      ),
      AdministratorId: 2,
    },
    {
      mitraName: 'Jack Doe',
      email: 'Jack.doe@example.com',
      password: hashPassword('password123'),
      role: 'driver',
      balance: 5000,
      status: 'active',
      location: sequelize.fn(
        'ST_GeomFromText',
        'POINT(107.5925576773082 -6.940669415817259)'
      ),
      AdministratorId: 1,
    },
  ]);

  await User.bulkCreate([
    {
      username: 'alex01',
      email: 'alex01@example.com',
      password: 'securepass123',
      balance: 2500,
      imgUrl: 'https://example.com/images/alex01.jpg',
    },
    {
      username: 'sara87',
      email: 'sara87@example.com',
      password: 'password789',
      balance: 5000,
      imgUrl: 'https://example.com/images/sara87.jpg',
    },
  ]);

  await Service.bulkCreate([
    {
      AdministratorId: 1,
      name: 'Fotocopy HVS A4/F4',
      price: 500,
      description:
        'Fotokopi dengan ukuran kertas A4 ataupun F4. Harga per lembar',
      imgUrl:
        'http://www.librairie-traitdunion.com/templates/yootheme/cache/photocopieur-b2a0999c.jpeg',
      type: 'service',
    },
    {
      AdministratorId: 1,
      name: 'Laminating / Laminasi Dokumen',
      price: 4000,
      description: 'Jasa laminating sesuai deskripsi',
      imgUrl:
        'https://2.bp.blogspot.com/-wNaD6ivMMc4/WhxKE--GGGI/AAAAAAAAA1o/XHP8uLLct_k5HZznGfkm5uGuVCs0kHdtQCLcBGAs/s1600/IMG_20170721_204816.jpg',
      type: 'service',
    },
  ]);

  await Order.bulkCreate([
    {
      AdministratorId: 1,
      UserId: 1,
      totalPrice: 15000,
      orderStatus: 'Queued',
      orderDate: new Date(),
      location: sequelize.fn(
        'ST_GeomFromText',
        'POINT(107.5925576773082 -6.940669415817259)'
      ),
      deliveryMethod: 'Delivery',
    },
    {
      AdministratorId: 1,
      UserId: 1,
      totalPrice: 2000,
      orderStatus: 'Queued',
      orderDate: new Date(),
      location: sequelize.fn(
        'ST_GeomFromText',
        'POINT(107.5925576773082 -6.940669415817259)'
      ),
      deliveryMethod: 'Delivery',
    },
  ]);
}

module.exports = bulkInsertAdmin;
