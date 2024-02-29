const router = require("express").Router();
const prodi = require("../controller/prodiController.js")

router.post("/add-prodi",prodi.addProdi)
router.post("/edit-prodi/:prodi",prodi.editProdi)
router.delete("/delete-prodi/:prodi",prodi.deleteProdi)
router.get("/list-prodi",prodi.getListProdi)
module.exports = router