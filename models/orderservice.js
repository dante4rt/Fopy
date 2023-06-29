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
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Service ID is required' },
        notNull: { msg: 'Service ID is required' },
      }
    },
    OrderServiceID: DataTypes.INTEGER,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User ID is required' },
        notNull: { msg: 'User ID is required' },
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Order service name is required' },
        notNull: { msg: 'Order service name is required' },
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Quantity is required' },
        notNull: { msg: 'Quantity is required' },
      }
    },
    totalPage: DataTypes.INTEGER,
    url: DataTypes.STRING,
    deliveryMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Delivery method is required' },
        notNull: { msg: 'Delivery method is required' },
      }
    }
  }, {
    sequelize,
    modelName: 'OrderService',
  });
  return OrderService;
};