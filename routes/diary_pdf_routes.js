const express = require("express");
const router = express.Router();
const diaryPdfController = require("../controllers/diary_pdf_controller");
const { requireAdmin, requireAuth } = require("../middlewares/auth_middleware");


router.post("/", requireAdmin, diaryPdfController.uploadDiaryPdf);
router.get("/", requireAuth, diaryPdfController.getDiaryPdfs);
router.get("/:id", requireAuth, diaryPdfController.getDiaryPdf);
router.delete("/:id", requireAdmin, diaryPdfController.deleteDiaryPdf);

module.exports = router;