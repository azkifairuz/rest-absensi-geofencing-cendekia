const { Jadwal, Kelas, MataKuliah, Dosen, Prodi } = require("../models");
const {
  responseData,
  internalError,
  responseMessage,
  responseWithPagination,
} = require("../utils/responseHandle");

async function createJadwal(req, res) {
  const { hari, jam_masuk, jam_keluar, id_kelas, id_mk, id_dosen } = req.body;
  if (!hari && !jam_masuk && !jam_keluar && !id_kelas && !id_mk && !id_dosen) {
    return responseMessage(
      res,
      400,
      "Tidak Boleh Ada Field Yang Kosong",
      false
    );
  }

  await Jadwal.create({
    hari: hari,
    jam_masuk: jam_masuk,
    jam_keluar: jam_keluar,
    id_kelas: id_kelas,
    id_mk: id_mk,
    id_dosen: id_dosen,
  });
  return responseMessage(res, 200, "Berhasil membuat jadwal");
}

async function editJadwal(req, res) {
  const { hari, jam_masuk, jam_keluar, id_kelas, id_mk, id_dosen } = req.body;
  const { jadwal } = req.params;
  if (!hari && !jam_masuk && !jam_keluar && !id_dosen) {
    return responseMessage(
      res,
      400,
      "Tidak Boleh Ada Field Yang Kosong",
      false
    );
  }

  if (!jadwal) {
    return responseMessage(res, 400, "id tidak boleh kosong", false);
  }

  const dataJadwal = await Jadwal.findOne({
    where: { id: jadwal },
  });
  if (!dataJadwal) {
    return responseMessage(res, 404, "jadwal tidak ditemukan");
  }

  Jadwal.update(
    {
      hari: hari,
      jam_masuk: jam_masuk,
      jam_keluar: jam_keluar,
      id_kelas: id_kelas,
      id_mk: id_mk,
      id_dosen: id_dosen,
    },
    { where: { id: jadwal } }
  );

  return responseMessage(res, 200, "update data berhasil");
}

async function listJadwal(req, res) {
  const page = req.query.page || 1;
  const pageSize = 10;
  try {
    const { count, rows: jadwals } = await Jadwal.findAndCountAll({
      include: [
        {
          model: Kelas,
          attributes: ["kode_kelas", "id_prodi"],
          as: "kelas",
          include: [
            {
              model: Prodi,
              attributes: ["prodi"],
              as: "prodi",
            },
          ],
        },
        {
          model: MataKuliah,
          attributes: ["kode_mk", "mata_kuliah"],
          as: "mk",
        },
        {
          model: Dosen,
          attributes: ["nm_dosen"],
          as: "dosen",
        },
      ],
      limit: pageSize,
      ofset: (page - 1) * pageSize,
    });
    const totalPages = Math.ceil(count / pageSize);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalPosts: count,
    };
    const formatedJadwal = await jadwals.map((jadwal) => {
      return {
        id_jadwal: jadwal.id,
        hari: jadwal.hari,
        jam_masuk: jadwal.jam_masuk,
        jam_keluar: jadwal.jam_keluar,
        id_kelas: jadwal.id_kelas,
        kelas: jadwal.kelas.kode_kelas,
        prodi: jadwal.kelas.prodi.prodi,
        id_dosen: jadwal.id_dosen,
        dosen: jadwal.dosen.nm_dosen,
        mata_kuliah: jadwal.mk.mata_kuliah,
      };
    });
    responseWithPagination(res, 200, formatedJadwal, paginationInfo, false);
  } catch (error) {
    internalError(res);
  }
}

async function listJadwalBykelas(req, res) {
  const { kelas } = req.params
  try {
    const jadwals  = await Jadwal.findAll({
      include: [
        {
          model: Kelas,
          attributes: ["kode_kelas", "id_prodi"],
          as: "kelas",
          include: [
            {
              model: Prodi,
              attributes: ["prodi"],
              as: "prodi",
            },
          ],
        },
        {
          model: MataKuliah,
          attributes: ["kode_mk", "mata_kuliah"],
          as: "mk",
        },
        {
          model: Dosen,
          attributes: ["nm_dosen"],
          as: "dosen",
        },
      ],
      where: {
        id_kelas:kelas
      }
    });

    const formatedJadwal = await jadwals.map((jadwal) => {
      return {
        id_jadwal: jadwal.id,
        hari: jadwal.hari,
        jam_masuk: jadwal.jam_masuk,
        jam_keluar: jadwal.jam_keluar,
        id_kelas: jadwal.id_kelas,
        kelas: jadwal.kelas.kode_kelas,
        prodi: jadwal.kelas.prodi.prodi,
        id_dosen: jadwal.id_dosen,
        dosen: jadwal.dosen.nm_dosen,
        mata_kuliah: jadwal.mk.mata_kuliah,
      };
    });
    responseData(res, 200, formatedJadwal, false);
  } catch (error) {
    internalError(res);
  }
}

async function listJadwalByDosen(req, res) {
  const { dosen } = req.params
  try {
    const jadwals  = await Jadwal.findAll({
      include: [
        {
          model: Kelas,
          attributes: ["kode_kelas", "id_prodi"],
          as: "kelas",
          include: [
            {
              model: Prodi,
              attributes: ["prodi"],
              as: "prodi",
            },
          ],
        },
        {
          model: MataKuliah,
          attributes: ["kode_mk", "mata_kuliah"],
          as: "mk",
        },
        {
          model: Dosen,
          attributes: ["nm_dosen"],
          as: "dosen",
        },
      ],
      where: {
        id_dosen:dosen
      }
    });

    const formatedJadwal = await jadwals.map((jadwal) => {
      return {
        id_jadwal: jadwal.id,
        hari: jadwal.hari,
        jam_masuk: jadwal.jam_masuk,
        jam_keluar: jadwal.jam_keluar,
        id_kelas: jadwal.id_kelas,
        kelas: jadwal.kelas.kode_kelas,
        prodi: jadwal.kelas.prodi.prodi,
        id_dosen: jadwal.id_dosen,
        dosen: jadwal.dosen.nm_dosen,
        mata_kuliah: jadwal.mk.mata_kuliah,
      };
    });
    responseData(res, 200, formatedJadwal, false);
  } catch (error) {
    internalError(res);
  }
}

async function detailJadwal(req, res) {
  try {
    const { jadwal } = req.params;
    const dataJadwal = await Jadwal.findOne({
      include: [
        {
          model: Kelas,
          attributes: ["kode_kelas", "id_prodi"],
          as: "kelas",
          include: [
            {
              model: Prodi,
              attributes: ["prodi"],
              as: "prodi",
            },
          ],
        },
        {
          model: MataKuliah,
          attributes: ["kode_mk", "mata_kuliah"],
          as: "mk",
        },
        {
          model: Dosen,
          attributes: ["nm_dosen"],
          as: "dosen",
        },
      ],
      where: { id: jadwal },
    });
    if (!dataJadwal) {
      responseMessage(res,404,"jadwal tidak ditemukan",false)
    }
    const jadwalResponse = {
      id_jadwal: dataJadwal.id,
      hari: dataJadwal.hari,
      jam_masuk: dataJadwal.jam_masuk,
      jam_keluar: dataJadwal.jam_keluar,
      id_kelas: dataJadwal.id_kelas,
      kelas: dataJadwal.kelas.kode_kelas,
      prodi: dataJadwal.kelas.prodi.prodi,
      id_dosen: dataJadwal.id_dosen,
      dosen: dataJadwal.dosen.nm_dosen,
      mata_kuliah: dataJadwal.mk.mata_kuliah,
    };
    responseData(res,200,jadwalResponse,false)
  } catch (error) {
    internalError(error)
  }
}
async function deleteJadwal(req, res) {
  try {
    const { jadwal } = req.params;
    const deleteReturn = await Jadwal.destroy({
      where: { id: jadwal },
    });
    if (!deleteReturn) {
      return responseMessage(res, 404, "jadwal tidak ditemukan", false);
    }

    return responseMessage(res, 200, "berhasil menghapus jadwal", false);
  } catch (error) {
    internalError(res);
  }
}

module.exports = {
  createJadwal,
  editJadwal,
  listJadwal,
  listJadwalBykelas,
  listJadwalByDosen,
  deleteJadwal,
  detailJadwal,
};
