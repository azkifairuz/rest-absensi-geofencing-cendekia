const { Fakultas,Prodi } = require("../models");
const {
  responseMessage,
  responseData,
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
        fakultas: prodi.fakultas.fakultas

      };
    });
    responseWithPagination(
      res,
      200,
      formatedProdi,
      paginationInfo,
      false

    )
  } catch (error) {
    console.log("error",error);
    internalError(res)
  }
}
async function addProdi(req, res) {
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

    const existingKodeFk = Fakultas.findOne({
      where: { kode_fakultas: kode_fakultas },
    });

    if (!existingKodeFk) {
      return responseMessage(res, 404, "kode fakultas sudah ada", false);
    }

    await Fakultas.create({
      kode_fakultas: kode_fakultas,
      fakultas: nm_fakultas,
    });

    return responseMessage(res, 200, "fakultas berhasil ditambahkan", false);
  } catch (error) {
    console.error("Error adding fakultas:", error);

    if (t) await t.rollback();

    return internalError(res);
  }
}

async function editProdi(req, res) {
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

async function deleteProdi(req, res) {
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
  addProdi,
  editProdi,
  deleteProdi,
  getListProdi,
};
