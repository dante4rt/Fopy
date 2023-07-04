'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.Administrator)
      Service.hasMany(models.OrderDetail)
    }
  }
  Service.init({
    AdministratorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Administrator ID is required' },
        notNull: { msg: 'Administrator ID is required' },
      }
    },
    name: {
      type: DataTypes.STRING,

    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Price is required' },
        notNull: { msg: 'Price is required' },
      }
    },
    description: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Type is required' },
        notNull: { msg: 'Type is required' },
      }
    }
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};