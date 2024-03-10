const { Prodi, Kelas } = require("../models");
const {
  responseMessage,
  internalError,
  responseWithPagination,
} = require("../utils/responseHandle");

async function getListKelas(req, res) {
  const page = req.query.page || 1;
  const pageSize = 10;
  try {
    const { count, rows: kelas } = await Kelas.findAndCountAll({
      include: [
        {
          model: Prodi,
          attributes: ["kode_prodi", "prodi"],
          as: "prodi",
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const totalPages = Math.ceil(count / pageSize);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: count,
    };
    const formatedKelas = kelas.map((item) => {
      const idKelas = item.id;
      console.log(item);
      return {
        idKelas,
        kode_kelas: item.kode_kelas,
        kelas: item.kelas,
        id_prodi: item.id_prodi,
        prodi: item.prodi.prodi,
        kode_prodi: item.prodi.kode_prodi,
      };
    });
    responseWithPagination(res, 200, formatedKelas, paginationInfo, false);
  } catch (error) {
    console.log("error", error);
    internalError(res);
  }
}
async function addKelas(req, res) {
  try {
    const { kode_kelas, prodi } = req.body;
    if (!kode_kelas) {
      return responseMessage(res, 400, "kode kelas tidak boleh kosong", false);
    }
    if (!prodi) {
      return responseMessage(res, 400, "prodi tidak boleh kosong", false);
    }
    const existingKodeFk = await Kelas.findOne({
      where: { kode_kelas: kode_kelas },
    });

    if (existingKodeFk) {
      return responseMessage(res, 404, "kelas sudah ada", false);
    }

    await Kelas.create({
      kode_kelas: kode_kelas,
      id_prodi: prodi,
    });

    return responseMessage(res, 200, "kelas berhasil ditambahkan", false);
  } catch (error) {
    console.error("Error adding kelas:", error);
    return internalError(res);
  }
}

async function deleteKelas(req, res) {
  try {
    const { kelas } = req.params;
    if (!kelas) {
      return responseMessage(res, 400, "wajib isi angka setelah /", false);
    }

    const deleteReturn = await Kelas.destroy({
      where: { id: kelas },
    });
    if (!deleteReturn) {
      return responseMessage(res, 404, "kelas tidak ditemukan", false);
    }

    return responseMessage(res, 200, "berhasil menghapus kelas", false);
  } catch (error) {
    console.log("failed:", error);
    return internalError(res);
  }
}

module.exports = {
  addKelas,
  deleteKelas,
  getListKelas,
};
