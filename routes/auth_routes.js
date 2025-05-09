const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const importOffices = require("../utils/import_office");
const importUsers = require("../utils/import_users");

router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);
router.get("/import_offices", importOffices);
router.get("/import_users", importUsers);

module.exports = router;
