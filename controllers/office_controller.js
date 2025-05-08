const { body } = require("express-validator");
const validate = require("../middlewares/validate_middleware");
const Office = require("../models/office");
const { UniqueConstraintError } = require("sequelize");

const officeValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("alternate_email").optional().isEmail().withMessage("Valid alternate email is required"),
  body("phone_number").notEmpty().withMessage("Phone number is required"),
  body("alternate_phone_number").optional().notEmpty().withMessage("Alternate phone number cannot be empty"),
  body("address").notEmpty().withMessage("Address is required"),
];

exports.createOffice = [
  officeValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, alternate_email, phone_number, alternate_phone_number, address } = req.body;
      const office = await Office.create({
        name,
        email,
        alternate_email,
        phone_number,
        alternate_phone_number,
        address,
      });
      res.status(201).json(office);
    } catch (error) {
      console.error("Error creating office:", error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: "Email already exists" });
        }
        if (error.fields.alternate_email) {
          return res.status(400).json({ error: "Alternate email already exists" });
        }
      }
      res.status(500).json({ error: "Failed to create office", details: error.message });
    }
  },
];

exports.getOffices = async (req, res) => {
  try {
    const offices = await Office.findAll();
    res.json(offices);
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).json({ error: "Failed to fetch offices", details: error.message });
  }
};

exports.getOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ error: "Office not found" });
    }
    res.json(office);
  } catch (error) {
    console.error("Error fetching office:", error);
    res.status(500).json({ error: "Failed to fetch office", details: error.message });
  }
};

exports.updateOffice = [
  officeValidation,
  validate,
  async (req, res) => {
    try {
      const office = await Office.findByPk(req.params.id);
      if (!office) {
        return res.status(404).json({ error: "Office not found" });
      }
      const { name, email, alternate_email, phone_number, alternate_phone_number, address } = req.body;
      await office.update({
        name,
        email,
        alternate_email,
        phone_number,
        alternate_phone_number,
        address,
      });
      res.json(office);
    } catch (error) {
      console.error("Error updating office:", error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: "Email already exists" });
        }
        if (error.fields.alternate_email) {
          return res.status(400).json({ error: "Alternate email already exists" });
        }
      }
      res.status(500).json({ error: "Failed to update office", details: error.message });
    }
  },
];

exports.deleteOffice = async (req, res) => {
  try {
    const office = await Office.findByPk(req.params.id);
    if (!office) {
      return res.status(404).json({ error: "Office not found" });
    }
    await office.destroy();
    res.json({ message: "Office deleted" });
  } catch (error) {
    console.error("Error deleting office:", error);
    res.status(500).json({ error: "Failed to delete office", details: error.message });
  }
};

// const { body } = require("express-validator");
// const validate = require("../middlewares/validate_middleware");
// const Office = require("../models/office");
// const { UniqueConstraintError } = require("sequelize");

// const officeValidation = [
//   body("name").notEmpty().withMessage("Name is required"),
//   body("email").isEmail().withMessage("Valid email is required"),
//   body("phone_number").notEmpty().withMessage("Phone number is required"),
//   body("address").notEmpty().withMessage("Address is required"),
// ];

// exports.createOffice = [
//   officeValidation,
//   validate,
//   async (req, res) => {
//     try {
//       const { name, email, phone_number, address } = req.body;
//       const office = await Office.create({ name, email, phone_number, address });
//       res.status(201).json(office);
//     } catch (error) {
//       console.error("Error creating office:", error);
//       if (error instanceof UniqueConstraintError) {
//         if (error.fields.email) {
//           return res.status(400).json({ error: "Email already exists" });
//         }
//       }
//       res.status(500).json({ error: "Failed to create office", details: error.message });
//     }
//   },
// ];

// exports.getOffices = async (req, res) => {
//   try {
//     const offices = await Office.findAll();
//     res.json(offices);
//   } catch (error) {
//     console.error("Error fetching offices:", error);
//     res.status(500).json({ error: "Failed to fetch offices", details: error.message });
//   }
// };

// exports.getOffice = async (req, res) => {
//   try {
//     const office = await Office.findByPk(req.params.id);
//     if (!office) {
//       return res.status(404).json({ error: "Office not found" });
//     }
//     res.json(office);
//   } catch (error) {
//     console.error("Error fetching office:", error);
//     res.status(500).json({ error: "Failed to fetch office", details: error.message });
//   }
// };

// exports.updateOffice = [
//   officeValidation,
//   validate,
//   async (req, res) => {
//     try {
//       const office = await Office.findByPk(req.params.id);
//       if (!office) {
//         return res.status(404).json({ error: "Office not found" });
//       }
//       const { name, email, phone_number, address } = req.body;
//       await office.update({ name, email, phone_number, address });
//       res.json(office);
//     } catch (error) {
//       console.error("Error updating office:", error);
//       if (error instanceof UniqueConstraintError) {
//         if (error.fields.email) {
//           return res.status(400).json({ error: "Email already exists" });
//         }
//       }
//       res.status(500).json({ error: "Failed to update office", details: error.message });
//     }
//   },
// ];

// exports.deleteOffice = async (req, res) => {
//   try {
//     const office = await Office.findByPk(req.params.id);
//     if (!office) {
//       return res.status(404).json({ error: "Office not found" });
//     }
//     await office.destroy();
//     res.json({ message: "Office deleted" });
//   } catch (error) {
//     console.error("Error deleting office:", error);
//     res.status(500).json({ error: "Failed to delete office", details: error.message });
//   }
// };
