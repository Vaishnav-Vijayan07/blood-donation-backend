const express = require("express");
const router = express.Router();
const officeController = require("../controllers/office_controller");
const { requireAdmin, requireAuth } = require("../middlewares/auth_middleware");

router.post("/", requireAdmin, officeController.createOffice);
router.get("/", requireAuth, officeController.getOffices); // Changed to requireAuth
router.get("/:id", requireAuth, officeController.getOffice); // Changed to requireAuth
router.put("/:id", requireAdmin, officeController.updateOffice);
router.delete("/:id", requireAdmin, officeController.deleteOffice);

module.exports = router;
