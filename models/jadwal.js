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
      Jadwal.belongsTo(models.Kelas, { foreignKey: "id_kelas", as: "kelas" });
      Jadwal.belongsTo(models.MataKuliah, { foreignKey: "id_mk", as: "mk" });
      Jadwal.belongsTo(models.Dosen, { foreignKey: "id_dosen", as: "dosen" });

    }
  }
  Jadwal.init({
    hari: DataTypes.STRING,
    jam_masuk: DataTypes.TIME,
    jam_keluar: DataTypes.TIME,
    id_kelas: DataTypes.INTEGER,
    id_mk: DataTypes.INTEGER,
    id_dosen: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Jadwal',
  });
  return Jadwal;
};