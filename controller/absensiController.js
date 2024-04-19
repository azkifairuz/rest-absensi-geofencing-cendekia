const {
  responseMessage,
  responseData,
  internalError,
} = require("../utils/responseHandle");
const  {formatDate} = require("../utils/dateFormat")
const { AbsensiDosen } = require("../models");
async function absensiDosen(req, res) {
  const { jadwal, type, dosen, status, inLocation } = req.body;

  if (!dosen && !type && !jadwal && !status) {
    return responseMessage(res, 400, "field tidak boleh kosong", false);
  }
  if (status != 'hadir') {
    await AbsensiDosen.create({
      id_jadwal: jadwal,
      id_dosen:dosen,
      tanggal:formatDate(new Date()),
      tipe_kelas:type,
      status_kehadiran:status
    });
    return responseMessage(res, 200, "berhasil absen", true);
  }
  //cek dulu type nya apa? klo online g dilokasi ya gpp
  if (!inLocation) {
    if (type == "offline") {
      return responseMessage(res, 400, "anda tidak dilokasi", false);
    }

    if (type == "online") {
      await AbsensiDosen.create({
        id_jadwal: jadwal,
        id_dosen:dosen,
        tanggal:formatDate(new Date()),
        tipe_kelas:type,
        status_kehadiran:status
      });
      return responseMessage(res, 200, "berhasil absen", true);
    }
  }

  await AbsensiDosen.create({
    id_jadwal: jadwal,
    id_dosen:dosen,
    tanggal:formatDate(new Date()),
    tipe_kelas:type,
    status_kehadiran:status
  });
  return responseMessage(res, 200, "berhasil absen", true);

}
