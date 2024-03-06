const router = require('express').Router();
const kelas = require('../controller/kelasController.js')

router.post("/add-kelas",kelas.addKelas)
router.delete("/delete-kelas/:kelas",kelas.deleteKelas)
router.get("/list-kelas",kelas.getListKelas)

module.exports = router