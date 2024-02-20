'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jadwal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Jadwal.init({
    jam_masuk: DataTypes.TIME,
    jam_keluar: DataTypes.TIME,
    tanggal: DataTypes.DATE,
    id_kelas: DataTypes.INTEGER,
    id_mk: DataTypes.INTEGER,
    id_dosen: DataTypes.INTEGER,
    tipe_kelas: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Jadwal',
  });
  return Jadwal;
};