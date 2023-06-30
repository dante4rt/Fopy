'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class Administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Administrator.hasMany(models.Order)
      Administrator.hasMany(models.Service)
    }
  }
  Administrator.init({
    mitraName: DataTypes.STRING,
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Role is required' },
        notNull: { msg: 'Role is required' },
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Status is required' },
        notNull: { msg: 'Status is required' },
      }
    },
    location: DataTypes.GEOMETRY,
    AdministratorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administrator',
  });
  Administrator.beforeCreate((data, options) => {
    data.password = hashPassword(data.password)
  })
  return Administrator;
};
