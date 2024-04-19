'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AbsensiMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbsensiMahasiswa.init({
    id_jadwal: DataTypes.INTEGER,
    id_mahasiswa: DataTypes.INTEGER,
    tanggal: DataTypes.DATEONLY,
    status_kehadiran: DataTypes.ENUM("hadir","izin","sakit","tanpa keterangan")
  }, {
    sequelize,
    modelName: 'AbsensiMahasiswa',
  });
  return AbsensiMahasiswa;
};