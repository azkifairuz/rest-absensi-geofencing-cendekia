const { Dosen, Mahasiswa, Account, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  responseMessage,
  responseData,
  internalError,
} = require("../utils/responseHandle");

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username) {
      return responseMessage(res, 400, "username tidak boleh kosong", false);
    }
    if (!password) {
      return responseMessage(res, 400, "password tidak boleh kosong", false);
    }
    const user = await Account.findOne({ where: { username } });

    if (!user) {
      return responseMessage(res, 401, "username belum terdaftar");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseMessage(res, 401, "password salah");
    }

    const token = jwt.sign(
      { userId: user.id },
      "a40a47053167cb92bcb9b46ceff99ae2b734f758fbd565b1d70fb73ca2c16458",
      { expiresIn: "360d" }
    );
    await Account.update(
      { remembered_token: token },
      { where: { id: user.id } }
    );

    responseData(
      res,
      200,
      {
        token: token,
        id_user: user.id,
        username: user.username,
        roles: user.role,
      },
      "Login successful"
    );
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, "Internal server error");
  }
}

async function changePassword(req,res){

}

async function registerDosen(req, res) {
  try {
    const { nidn, nm_dosen } = req.body;
    if (!nidn) {
      return responseMessage(res, 400, "nidn tidak boleh kosong", false);
    }
    if (!nm_dosen) {
      return responseMessage(res, 400, "nama dosen tidak boleh kosong", false);
    }
    const existingNidn = await Dosen.findOne({ where: { nidn: nidn } });
    const t = await sequelize.transaction();

    if (existingNidn) {
      return responseMessage(
        res,
        400,
        "dosen dengan nidn ini sudah ada",
        false
      );
    }
    const dosenResult = await Dosen.create(
      {
        nidn: nidn,
        nm_dosen: nm_dosen,
      },
      { transaction: t }
    );
    //   console.log("Result", mahasiswaResult);
    const name = dosenResult.dataValues.nm_dosen.replace(/\s+/g, "_");
    const dosen_id = dosenResult.dataValues.id;

    const defaultPw = name + "123";

    const passwordHash = await bcrypt.hash(defaultPw, 10);
    await Account.create(
      {
        owner: dosen_id,
        username: nidn,
        password: passwordHash,
        role: "dosen",
      },
      { transaction: t }
    );
    await t.commit();

    return responseMessage(res, 200, "data dosen added succes", "false");
  } catch (error) {
    console.error("Error adding DOsen:", error);

    if (t) await t.rollback();

    return internalError(res);
  }
}

async function registerMhs(req, res) {
  try {
    const { nim, nm_mahasiswa, kelas } = req.body;
    if (!nim) {
      return responseMessage(res, 400, "nim tidak boleh kosong", false);
    }
    if (!nm_mahasiswa) {
      return responseMessage(
        res,
        400,
        "nama mahsiswa tidak boleh kosong",
        false
      );
    }
    if (!kelas) {
      return responseMessage(res, 400, "kelas tidak boleh kosong", false);
    }
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
  login,
  registerDosen,
  registerMhs,
};
