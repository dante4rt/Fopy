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
      Order.hasMany(models.OrderDetail)
      Order.belongsTo(models.User)
      Order.belongsTo(models.Administrator)
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
    location: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Location is required' },
        notNull: { msg: 'Location is required' },
      }
    },
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
    modelName: 'Order',
  });
  return Order;
};