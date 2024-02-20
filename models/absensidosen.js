'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbsensiDosen.init({
    id_jadwal: DataTypes.INTEGER,
    id_dosen: DataTypes.INTEGER,
    status_kehadiran: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'AbsensiDosen',
  });
  return AbsensiDosen;
};