const { body } = require("express-validator");
const validate = require("../middlewares/validate_middleware");
const Rank = require("../models/rank");
const { UniqueConstraintError } = require("sequelize");

const rankValidation = [body("name").notEmpty().withMessage("Rank name is required")];

exports.createRank = [
  rankValidation,
  validate,
  async (req, res) => {
    try {
      const { name } = req.body;
      

      const rank = await Rank.create({ name });

      res.status(201).json(rank);
    } catch (error) {
      console.error("Error creating rank:", error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: "Rank name already exists" });
      }
      res.status(500).json({ error: "Failed to create rank", details: error.message });
    }
  },
];

exports.getRanks = async (req, res) => {
  try {
    const ranks = await Rank.findAll({
      order: [["name", "ASC"]],
    });
    res.json(ranks);
  } catch (error) {
    console.error("Error fetching ranks:", error);
    res.status(500).json({ error: "Failed to fetch ranks", details: error.message });
  }
};

exports.getRank = async (req, res) => {
  try {
    const rank = await Rank.findByPk(req.params.id);
    if (!rank) {
      return res.status(404).json({ error: "Rank not found" });
    }
    res.json(rank);
  } catch (error) {
    console.error("Error fetching rank:", error);
    res.status(500).json({ error: "Failed to fetch rank", details: error.message });
  }
};

exports.updateRank = [
  rankValidation,
  validate,
  async (req, res) => {
    try {
      const rank = await Rank.findByPk(req.params.id);
      if (!rank) {
        return res.status(404).json({ error: "Rank not found" });
      }

      const { name } = req.body;
      await rank.update({ name });

      res.json(rank);
    } catch (error) {
      console.error("Error updating rank:", error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: "Rank name already exists" });
      }
      res.status(500).json({ error: "Failed to update rank", details: error.message });
    }
  },
];

exports.deleteRank = async (req, res) => {
  try {
    const rank = await Rank.findByPk(req.params.id);
    if (!rank) {
      return res.status(404).json({ error: "Rank not found" });
    }
    await rank.destroy();
    res.json({ message: "Rank deleted" });
  } catch (error) {
    console.error("Error deleting rank:", error);
    res.status(500).json({ error: "Failed to delete rank", details: error.message });
  }
};
