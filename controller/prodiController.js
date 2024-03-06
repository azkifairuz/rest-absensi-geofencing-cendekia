const { Fakultas, Prodi } = require("../models");
const {
  responseMessage,
  internalError,
  responseWithPagination,
} = require("../utils/responseHandle");

async function getListProdi(req, res) {
  const page = req.query.page || 1;
  const pageSize = 10;
  try {
    const { count, rows: prodis } = await Prodi.findAndCountAll({
      include: [
        {
          model: Fakultas,
          attributes: ["kode_fakultas", "fakultas"],
          as: "fakultas",
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const totalPages = Math.ceil(count / pageSize);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalPosts: count,
    };
    const formatedProdi = prodis.map((prodi) => {
      const idProdi = prodi.id;

      return {
        idProdi,
        kode_prodi: prodi.kode_prodi,
        prodi: prodi.prodi,
        id_fakultas: prodi.id_fakultas,
        fakultas: prodi.fakultas.fakultas,
      };
    });
    responseWithPagination(res, 200, formatedProdi, paginationInfo, false);
  } catch (error) {
    console.log("error", error);
    internalError(res);
  }
}
async function addProdi(req, res) {
  try {
    const { kode_prodi, nm_prodi, fakultas } = req.body;
    if (!kode_prodi) {
      return responseMessage(res, 400, "kode prodi tidak boleh kosong", false);
    }
    if (!nm_prodi) {
      return responseMessage(res, 400, "nama prodi tidak boleh kosong", false);
    }
    if (!fakultas) {
      return responseMessage(res, 400, "fakultas tidak boleh kosong", false);
    }

    const existingKodeFk =await Prodi.findOne({
      where: { kode_prodi: kode_prodi },
    });

    if (existingKodeFk) {

      return responseMessage(res, 404, "kode prodi sudah ada", false);
    }

    await Prodi.create({
      kode_prodi: kode_prodi,
      prodi: nm_prodi,
      id_fakultas: fakultas,
    });

    return responseMessage(res, 200, "prodi berhasil ditambahkan", false);
  } catch (error) {
    console.error("Error adding prodi:", error);
    return internalError(res);
  }
}

async function editProdi(req, res) {
  try {
    const { nm_prodi } = req.body;
    const { prodi } = req.params;
    const dataProdi = await Prodi.findOne({
      where: { kode_prodi: prodi },
    });
    if (!dataProdi) {
      return responseMessage(
        res,
        404,
        `prodi dengan kode ${prodi} tidak ada`,
        false
      );
    }
    if (!nm_prodi) {
      return responseMessage(res, 400, "nama prodi tidak boleh kosong", false);
    }
    await Prodi.update({ prodi: nm_prodi }, { where: { kode_prodi: prodi } });
    return responseMessage(res, 200, "berhasil mengubah nama prodi", false);
  } catch (error) {
    console.log("failed change name:", error);
    internalError(res);
  }
}

async function deleteProdi(req, res) {
  try {
    const { prodi } = req.params;
    if (!prodi) {
      return responseMessage(res, 400, "wajib isi angka setelah /", false);
    }

    const deleteReturn = await Prodi.destroy({
      where: { id: prodi },
    });
    if (!deleteReturn) {
      return responseMessage(res, 404, "prodi tidak ditemukan", false);
    }

    return responseMessage(res, 200, "berhasil menghapus prodi", false);
  } catch (error) {
    console.log("failed:", error);
    return internalError(res);
  }
}

module.exports = {
  addProdi,
  editProdi,
  deleteProdi,
  getListProdi,
};
