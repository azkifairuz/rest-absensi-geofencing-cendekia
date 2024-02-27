const router = require("express").Router();
const auth = require("../controller/authController.js");
router.post("/login", auth.login);

module.exports = router;