'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Service)
      OrderDetail.belongsTo(models.Order)
    }
  }
  OrderDetail.init({
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Service ID is required' },
        notNull: { msg: 'Service ID is required' },
      }
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Order ID is required' },
        notNull: { msg: 'Order ID is required' },
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
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};