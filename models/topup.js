'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Topup.belongsTo(models.User)
    }
  }
  Topup.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User ID is required' },
        notNull: { msg: 'User ID is required' },
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Amount is required' },
        notNull: { msg: 'Amount is required' },
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 'Pending',
      validate: {
        notEmpty: { msg: 'Status is required' },
        notNull: { msg: 'Status is required' },
      }
    }
  }, {
    sequelize,
    modelName: 'Topup',
  });
  return Topup;
};