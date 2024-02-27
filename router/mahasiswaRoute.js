const router = require("express").Router();
const mahasiswa = require("../controller/mahasiswaController.js");

router.post("/add-mhs", mahasiswa.addMahasiswa);

module.exports = router;