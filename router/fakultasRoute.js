const router = require("express").Router();
const fakultas = require("../controller/fakultasController.js")

router.post("/add-fakultas",fakultas.addFakultas)
router.post("/edit-fakultas/:fakultas",fakultas.editFakultas)
router.delete("/delete-fakultas/:fakultas",fakultas.deleteFakultas)
router.get("/list-fakultas",fakultas.getListFakultas)
module.exports = router