'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order)
      User.hasMany(models.OrderService, { foreignKey: 'UserId' })
      User.belongsToMany(models.Administrator, {
        through: models.Order
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email must be unique'
      },
      validate: {
        notEmpty: { msg: 'Email is required' },
        notNull: { msg: 'Email is required' },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        notNull: { msg: 'Password is required' },
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notEmpty: { msg: 'Balance is required' },
        notNull: { msg: 'Balance is required' },
      }
    },
    imgUrl: DataTypes.STRING,
    lat: DataTypes.STRING,
    lang: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};