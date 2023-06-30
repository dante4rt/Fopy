'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Administrator.init({
    mitraName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    status: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    AdministratorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Administrator',
  });
  return Administrator;
};