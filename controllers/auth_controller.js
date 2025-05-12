const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Admin = require("../models/admin");
const { body } = require("express-validator");
const validate = require("../middlewares/validate_middleware");

const loginValidation = [
  body("login_id").notEmpty().withMessage("Login ID is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const adminLoginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.login = [
  loginValidation,
  validate,
  async (req, res) => {
    const { login_id, password } = req.body;
    const user = await User.findOne({ where: { login_id } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, type: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  },
];

exports.adminLogin = [
  adminLoginValidation,
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin.id, type: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  },
];
