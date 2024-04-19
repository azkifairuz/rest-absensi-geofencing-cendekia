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
      AbsensiDosen.belongsTo(models.Jadwal, { foreignKey: "id_jadwal", as: "jadwal" });

    }
  }
  AbsensiDosen.init({
    id_jadwal: DataTypes.INTEGER,
    id_dosen: DataTypes.INTEGER,
    tanggal: DataTypes.DATEONLY,                                                                              
    tipe_kelas: DataTypes.ENUM("online","offline"),
    status_kehadiran: DataTypes.ENUM("hadir","izin","sakit","tanpa keterangan")
  }, {
    sequelize,
    modelName: 'AbsensiDosen',
  });
  return AbsensiDosen;
};