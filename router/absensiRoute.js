const router = require("express").Router();
const absensi = require("../controller/absensiController.js");
router.post("/absen-dosen", absensi.absensiDosen);
router.post("/absen-mhs", absensi.absensiMahasiswa);

module.exports = router;