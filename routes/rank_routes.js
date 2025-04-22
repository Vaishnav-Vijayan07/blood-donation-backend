const express = require("express");
const router = express.Router();
const rankController = require("../controllers/rank_controller");
const { requireAdmin, requireAuth } = require("../middlewares/auth_middleware");

// Rank CRUD routes
router.post("/", requireAdmin, rankController.createRank); // Create a new rank
router.get("/", requireAuth, rankController.getRanks); // Get all ranks
router.get("/:id", requireAuth, rankController.getRank); // Get a single rank by ID
router.put("/:id", requireAdmin, rankController.updateRank); // Update a rank by ID
router.delete("/:id", requireAdmin, rankController.deleteRank); // Delete a rank by ID

module.exports = router;
