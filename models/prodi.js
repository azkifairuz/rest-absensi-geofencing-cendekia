'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prodi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prodi.belongsTo(models.Fakultas, { foreignKey: 'id_fakultas', as: 'fakultas' });
    }
  }
  Prodi.init({
    kode_prodi: DataTypes.STRING,
    prodi: DataTypes.STRING,
    id_fakultas: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Prodi',
  });
  return Prodi;
};