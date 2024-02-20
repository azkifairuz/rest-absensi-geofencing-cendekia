'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jadwals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jam_masuk: {
        type: Sequelize.TIME
      },
      jam_keluar: {
        type: Sequelize.TIME
      },
      tanggal: {
        type: Sequelize.DATE
      },
      id_kelas: {
        type: Sequelize.INTEGER
      },
      id_mk: {
        type: Sequelize.INTEGER
      },
      id_dosen: {
        type: Sequelize.INTEGER
      },
      tipe_kelas: {
        type: Sequelize.ENUM("online","offline")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Jadwals');
  }
};