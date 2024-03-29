'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    owner: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    remembered_token: DataTypes.STRING,
    role: DataTypes.ENUM("dosen","mahasiswa","fakultas")
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};