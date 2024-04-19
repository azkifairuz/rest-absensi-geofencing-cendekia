const {
  responseMessage,
  responseData,
  internalError,
} = require("../utils/responseHandle");
const { formatDate } = require("../utils/dateFormat");
const { AbsensiDosen,AbsensiMahasiswa,Jadwal,Kelas,Dosen } = require("../models");

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
    return responseMessage(res, 400, "Dosen belum absen, mahasiswa tidak dapat absen", false);
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

async function getAllListAbsen(req,res) {
  const page = req.query.page || 1;
  const pageSize = 10;
  try {
    const { count, rows: jadwals } = await AbsensiDosen.findAndCountAll({
      attributes:[
        'id',
        'tipe_kelas',
        'tanggal',
      ],
      include: [
        {
          model: Jadwal,
          as: 'jadwals',
          attributes: [],
          include: [
            {
              model: Matakuliah,
              as: 'matakuliahs',
              attributes: [],
            },
            {
              model: Dosen,
              as: 'dosens',
              attributes: [],
            },
            {
              model: Kelas,
              as: 'kelas',
              include: {
                model: Prodi,
                as: 'prodi',
                attributes: [],
              },
              attributes: [],
            },
          ],
        },
      ],
      where: {
        tanggal: tanggal,
      },
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

module.exports = {
  absensiDosen,
  absensiMahasiswa,
};
