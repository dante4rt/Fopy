'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderService.init({
    ServiceId: DataTypes.INTEGER,
    OrderId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    totalPage: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderService',
  });
  return OrderService;
};