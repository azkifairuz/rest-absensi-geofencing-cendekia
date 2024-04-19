const {
  responseMessage,
  responseData,
  responseWithPagination,
  internalError,
} = require("../utils/responseHandle");
const { formatDate } = require("../utils/dateFormat");
const {
  AbsensiDosen,
  AbsensiMahasiswa,
  Jadwal,
  Kelas,
  Dosen,
  MataKuliah,
  Prodi,
} = require("../models");

async function absensiDosen(req, res) {
  const { jadwal, type, dosen, status, inLocation } = req.body;

  if (!dosen || !type || !jadwal || !status) {
    return responseMessage(res, 400, "field tidak boleh kosong", false);
  }
  const today = formatDate(new Date());
  const existingAbsence = await AbsensiDosen.findOne({
    where: {
      id_jadwal: jadwal,
      id_dosen: dosen,
      tanggal: today,
    },
  });
  if (existingAbsence) {
    return responseMessage(res, 400, "anda sudah absen hari ini", false);
  }

  if (status != "hadir") {
    await AbsensiDosen.create({
      id_jadwal: jadwal,
      id_dosen: dosen,
      tanggal: today,
      tipe_kelas: type,
      status_kehadiran: status,
    });
    return responseMessage(res, 200, "berhasil absen", true);
  }

  if (!inLocation) {
    if (type == "offline") {
      return responseMessage(res, 400, "anda tidak dilokasi", false);
    }

    if (type == "online") {
      await AbsensiDosen.create({
        id_jadwal: jadwal,
        id_dosen: dosen,
        tanggal: today,
        tipe_kelas: type,
        status_kehadiran: status,
      });
      return responseMessage(res, 200, "berhasil absen", true);
    }
  }

  await AbsensiDosen.create({
    id_jadwal: jadwal,
    id_dosen: dosen,
    tanggal: today,
    tipe_kelas: type,
    status_kehadiran: status,
  });
  return responseMessage(res, 200, "berhasil absen", true);
}

async function absensiMahasiswa(req, res) {
  const { jadwal, type, mahasiswa, status, inLocation } = req.body;

  if (!mahasiswa || !type || !jadwal || !status) {
    return responseMessage(res, 400, "field tidak boleh kosong", false);
  }

  const today = formatDate(new Date());
  const existingDosenAbsence = await AbsensiDosen.findOne({
    where: {
      id_jadwal: jadwal,
      tanggal: today,
    },
  });

  if (!existingDosenAbsence) {
    return responseMessage(
      res,
      400,
      "Dosen belum absen, mahasiswa tidak dapat absen",
      false
    );
  }
  const existingAbsence = await AbsensiMahasiswa.findOne({
    where: {
      id_jadwal: jadwal,
      id_mahasiswa: mahasiswa,
      tanggal: today,
    },
  });
  if (existingAbsence) {
    return responseMessage(res, 400, "anda sudah absen hari ini", false);
  }

  if (status != "hadir") {
    await AbsensiMahasiswa.create({
      id_jadwal: jadwal,
      id_mahasiswa: mahasiswa,
      tanggal: today,
      status_kehadiran: status,
    });
    return responseMessage(res, 200, "berhasil absen", true);
  }

  if (!inLocation) {
    if (type == "offline") {
      return responseMessage(res, 400, "anda tidak dilokasi", false);
    }

    if (type == "online") {
      await AbsensiMahasiswa.create({
        id_jadwal: jadwal,
        id_mahasiswa: mahasiswa,
        tanggal: today,
        status_kehadiran: status,
      });
      return responseMessage(res, 200, "berhasil absen", true);
    }
  }

  await AbsensiMahasiswa.create({
    id_jadwal: jadwal,
    id_mahasiswa: mahasiswa,
    tanggal: today,
    status_kehadiran: status,
  });
  return responseMessage(res, 200, "berhasil absen", true);
}

async function getAllListAbsen(req, res) {
  const { idJadwal } = req.params
  try {
    const  absensiDosen  = await AbsensiDosen.findAll({
      attributes: ["id", "tipe_kelas", "tanggal"],
      include: [
        {
          model: Jadwal,
          as: "jadwal",
          attributes: ["hari", "jam_masuk", "jam_keluar"],
          include: [
            {
              model: MataKuliah,
              as: "mk",
              attributes: ["mata_kuliah"],
            },
            {
              model: Dosen,
              as: "dosen",
              attributes: ["nm_dosen"],
            },
            {
              model: Kelas,
              as: "kelas",
              attributes: ["kode_kelas"],
              include: {
                model: Prodi,
                as: "prodi",
                attributes: ["prodi"],
              },
            },
          ],
        },
      ],
      where:{
        id_jadwal:idJadwal
      }
    });

    const formatedJadwal = await absensiDosen.map((absen) => {
      return {
        id: absen.id,
        kode_kelas: absen.jadwal.kelas.kode_kelas,
        mata_kuliah: absen.jadwal.mk.mata_kuliah,
        dosen: absen.jadwal.dosen.nm_dosen,
        tipe_kelas: absen.tipe_kelas,
        tanggal: absen.tanggal,
        jam_masuk: absen.jadwal.jam_masuk,
        jam_keluar: absen.jadwal.jam_keluar,
        tanggal: absen.jadwal.hari,
      };
    });
    responseData(res, 200, formatedJadwal, "success");
  } catch (error) {
    console.log(error);
    internalError(res);
  }
}

module.exports = {
  absensiDosen,
  absensiMahasiswa,
  getAllListAbsen,
};
