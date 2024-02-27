const { Mahasiswa, Account, sequelize } = require("../models");
const { responseMessage, internalError } = require("../utils/responseHandle");
const bcrypt = require("bcryptjs");

async function addMahasiswa(req, res) {
  try {
    const { nim, nm_mahasiswa, kelas } = req.body;
    const existingNim = await Mahasiswa.findOne({ where: { nim: nim } });
    const t = await sequelize.transaction();

    if (existingNim) {
      return responseMessage(
        res,
        400,
        "mahasiswa dengan nim ini sudah ada",
        "false"
      );
    }
    const mahasiswaResult = await Mahasiswa.create(
      {
        nim: nim,
        nm_mahasiswa: nm_mahasiswa,
        kelas: kelas,
      },
      { transaction: t }
    );
    //   console.log("Result", mahasiswaResult);
    const name = mahasiswaResult.dataValues.nm_mahasiswa.replace(/\s+/g, "_");
    const mhs_id = mahasiswaResult.dataValues.id;

    const defaultPw = name + "123";

    const passwordHash = await bcrypt.hash(defaultPw, 10);
    await Account.create(
      {
        owner: mhs_id,
        username: nim,
        password: passwordHash,
        role: "mahasiswa",
      },
      { transaction: t }
    );
    await t.commit();

    return responseMessage(res, 200, "data maasiswa added succes", "false");
  } catch (error) {
    console.error("Error adding Mahasiswa:", error);

    if (t) await t.rollback();

    return internalError(res);
  }
}
module.exports = {
  addMahasiswa,
};
