const router = require('express').Router();
const jadwal = require('../controller/jadwalController.js')

router.post("/add-jadwal",jadwal.createJadwal)
router.post("/edit-jadwal/:jadwal",jadwal.editJadwal)
router.delete("/delete-jadwal/:jadwal",jadwal.deleteJadwal)
router.get("/jadwals",jadwal.listJadwal)
router.get("/jadwal/:jadwal",jadwal.detailJadwal)
router.get("/jadwal-by-kelas/:kelas",jadwal.listJadwalBykelas)
router.get("/jadwal-by-dosen/:dosen",jadwal.listJadwalByDosen)

module.exports = router