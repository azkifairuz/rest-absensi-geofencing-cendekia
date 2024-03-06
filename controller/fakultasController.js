const { Fakultas } = require("../models");
const {
  responseMessage,
  internalError,
  responseWithPagination,
} = require("../utils/responseHandle");

async function getListFakultas(req, res) {
  const page = req.query.page || 1;
  const pageSize = 10;
  try {
    const { count, rows: fakultas } = await Fakultas.findAndCountAll({
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const totalPages = Math.ceil(count / pageSize);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalPosts: count,
    };
    responseWithPagination(
      res,
      200,
      fakultas,
      paginationInfo,
      false

    )
  } catch (error) {
    console.log("error",error);
    internalError(res)
  }
}
async function addFakultas(req, res) {
  try {
    const { kode_fakultas, nm_fakultas } = req.body;
    if (!kode_fakultas) {
      return responseMessage(
        res,
        400,
        "kode fakultas tidak boleh kosong",
        false
      );
    }
    if (!nm_fakultas) {
      return responseMessage(
        res,
        400,
        "nama fakultas tidak boleh kosong",
        false
      );
    }

    const existingKodeFk =await Fakultas.findOne({
      where: { kode_fakultas: kode_fakultas },
    });

    if (existingKodeFk) {
      return responseMessage(res, 404, "kode fakultas sudah ada", false);
    }

    await Fakultas.create({
      kode_fakultas: kode_fakultas,
      fakultas: nm_fakultas,
    });

    return responseMessage(res, 200, "fakultas berhasil ditambahkan", false);
  } catch (error) {
    console.error("Error adding fakultas:", error);


    return internalError(res);
  }
}

async function editFakultas(req, res) {
  try {
    const { nm_fakultas } = req.body;
    const { fakultas } = req.params;
    const dataFakultas = await Fakultas.findOne({
      where: { kode_fakultas: fakultas },
    });
    if (!dataFakultas) {
      return responseMessage(
        res,
        404,
        `fakultas dengan kode ${fakultas} tidak ada`,
        false
      );
    }
    if (!nm_fakultas) {
      return responseMessage(
        res,
        400,
        "nama fakultas tidak boleh kosong",
        false
      );
    }
    await Fakultas.update(
      { fakultas: nm_fakultas },
      { where: { kode_fakultas: fakultas } }
    );
    return responseMessage(res, 200, "berhasil mengubah nama fakultas", false);
  } catch (error) {
    console.log("failed change name:", error);
    internalError(res);
  }
}

async function deleteFakultas(req, res) {
  try {
    const { fakultas } = req.params;
    if (!fakultas) {
      return responseMessage(res, 400, "wajib isi angka setelah /", false);
    }

    const deleteReturn = await Fakultas.destroy({
      where: { id: fakultas },
    });
    if (!deleteReturn) {
      return responseMessage(res, 404, "fakultas tidak ditemukan", false);
    }

    return responseMessage(res, 200, "berhasil menghapus fakultas", false);
  } catch (error) {
    console.log("failed:", error);
    return internalError(res);
  }
}

module.exports = {
  addFakultas,
  editFakultas,
  deleteFakultas,
  getListFakultas,
};
