const { body } = require("express-validator");
const validate = require("../middlewares/validate_middleware");
const models = require("../models/associations");
const DiaryPdf = models.DiaryPdf;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/diaries/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `diary_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 30 * 1024 * 1024 }, // 10MB limit
});

exports.uploadDiaryPdf = [
  upload.single("diary_pdf"),
  body("file_name").optional().isString().withMessage("File name must be a string"),
  validate,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      const existingPdf = await DiaryPdf.findOne();
      if (existingPdf) {
        // Delete existing file
        const filePath = path.resolve(existingPdf.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        // Delete database record
        await existingPdf.destroy();
      }

      // Create new PDF record
      const diaryPdf = await DiaryPdf.create({
        file_path: req.file.path,
        file_name: req.body.file_name || req.file.originalname,
      });

      res.status(201).json({ status: true, data: diaryPdf });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Clean up on error
      }
      console.error("Error uploading diary PDF:", error);
      res.status(500).json({ error: "Failed to upload diary PDF", details: error.message });
    }
  },
];

exports.getDiaryPdfs = [
  async (req, res) => {
    try {
      const diaryPdfs = await DiaryPdf.findAll({
        order: [["uploaded_at", "DESC"]],
      });

      res.json({ status: true, data: diaryPdfs });
    } catch (error) {
      console.error("Error fetching diary PDFs:", error);
      res.status(500).json({ error: "Failed to fetch diary PDFs", details: error.message });
    }
  },
];

exports.getDiaryPdf = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const diaryPdf = await DiaryPdf.findByPk(id);
      if (!diaryPdf) {
        return res.status(404).json({ error: "Diary PDF not found" });
      }

      const filePath = path.resolve(diaryPdf.file_path);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "PDF file not found on server" });
      }

      res.download(filePath, diaryPdf.file_name || `diary_${id}.pdf`);
    } catch (error) {
      console.error("Error downloading diary PDF:", error);
      res.status(500).json({ error: "Failed to download diary PDF", details: error.message });
    }
  },
];

exports.deleteDiaryPdf = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const diaryPdf = await DiaryPdf.findByPk(id);
      if (!diaryPdf) {
        return res.status(404).json({ error: "Diary PDF not found" });
      }

      const filePath = path.resolve(diaryPdf.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await diaryPdf.destroy();
      res.json({ message: "Diary PDF deleted" });
    } catch (error) {
      console.error("Error deleting diary PDF:", error);
      res.status(500).json({ error: "Failed to delete diary PDF", details: error.message });
    }
  },
];
