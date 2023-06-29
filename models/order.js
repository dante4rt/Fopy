'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    UserId: DataTypes.INTEGER,
    totalAmount: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN,
    orderItem: DataTypes.STRING,
    orderStatus: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    deliveryMethod: DataTypes.STRING,
    invoiceId: DataTypes.INTEGER,
    OrderServiceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};