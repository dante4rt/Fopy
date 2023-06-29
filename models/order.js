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
    AdministratorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Administrator ID is required' },
        notNull: { msg: 'Administrator ID is required' },
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User ID is required' },
        notNull: { msg: 'User ID is required' },
      }
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Total price is required' },
        notNull: { msg: 'Total price is required' },
      }
    },
    orderItem: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Order item is required' },
        notNull: { msg: 'Order item is required' },
      }
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Order status is required' },
        notNull: { msg: 'Order status is required' },
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Order date is required' },
        notNull: { msg: 'Order date is required' },
      }
    },
    InvoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Invoice ID is required' },
        notNull: { msg: 'Invoice ID is required' },
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};