const router = require("express").Router();
const auth = require("../controller/authController.js");
router.post("/login", auth.login);
router.post("/register-dosen", auth.registerDosen);
router.post("/register-mhs", auth.registerMhs);

module.exports = router;