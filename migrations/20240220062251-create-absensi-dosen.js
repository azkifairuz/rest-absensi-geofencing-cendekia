"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AbsensiDosens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_jadwal: {
        type: Sequelize.INTEGER,
      },
      id_dosen: {
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      tipe_kelas: {
        type: Sequelize.ENUM("online", "offline"),
      },
      status_kehadiran: {
        type: Sequelize.ENUM("hadir", "izin", "sakit", "tanpa keterangan"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AbsensiDosens");
  },
};
