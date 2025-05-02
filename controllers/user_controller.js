const bcrypt = require("bcrypt");
const { body, query } = require("express-validator");
const validate = require("../middlewares/validate_middleware");
const models = require("../models/associations");
const User = models.User;
const Office = models.Office;
const Rank = models.Rank;
const generateLoginId = require("../utils/generate_login_id");
const multer = require("multer");
const path = require("path");
const { UniqueConstraintError, ForeignKeyConstraintError, Op } = require("sequelize");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-email-app-password",
  },
});

// Configure Multer storage to preserve file extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // e.g., '.png'
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG images are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const userValidation = [
  body("rank_id").isInt().withMessage("Valid Rank ID is required"),
  body("full_name").notEmpty().withMessage("Full Name is required"),
  body("blood_group").notEmpty().withMessage("Blood Group is required"),
  body("last_donated_date").optional().isDate().withMessage("Valid last donated date is required"),
  body("mobile_number").notEmpty().withMessage("Mobile Number is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("date_of_birth").isDate().withMessage("Valid date of birth is required"),
  body("service_start_date").isDate().withMessage("Valid service start date is required"),
  body("residential_address").notEmpty().withMessage("Residential Address is required"),
  body("office_id").isInt().withMessage("Valid Office ID is required"),
];

const changePasswordValidation = [
  body("current_password").notEmpty().withMessage("Current password is required"),
  body("new_password").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
];

const adminRequestPasswordChangeValidation = [
  body("user_id").optional().isInt().withMessage("Valid User ID is required"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body().custom((value, { req }) => {
    if (!req.body.user_id && !req.body.email) {
      throw new Error("Either user_id or email is required");
    }
    return true;
  }),
];

const updateUserValidation = [
  body("full_name").optional().notEmpty().withMessage("Full Name cannot be empty"),
  body("rank_id").optional().isInt().withMessage("Valid Rank ID is required"),
  body("blood_group").optional().notEmpty().withMessage("Blood Group cannot be empty"),
  body("last_donated_date").optional().isDate().withMessage("Valid last donated date is required"),
  body("mobile_number").optional().notEmpty().withMessage("Mobile Number cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("date_of_birth").optional().isDate().withMessage("Valid date of birth is required"),
  body("service_start_date").optional().isDate().withMessage("Valid service start date is required"),
  body("residential_address").optional().notEmpty().withMessage("Residential Address cannot be empty"),
  body("office_id").optional().isInt().withMessage("Valid Office ID is required"),
];

const profileUpdateValidation = [
  body("full_name").optional().notEmpty().withMessage("Full Name cannot be empty"),
  body("rank_id").optional().isInt().withMessage("Valid Rank ID is required"),
  body("blood_group").optional().notEmpty().withMessage("Blood Group cannot be empty"),
  body("last_donated_date").optional().isDate().withMessage("Valid last donated date is required"),
  body("mobile_number").optional().notEmpty().withMessage("Mobile Number cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("date_of_birth").optional().isDate().withMessage("Valid date of birth is required"),
  body("service_start_date").optional().isDate().withMessage("Valid service start date is required"),
  body("residential_address").optional().notEmpty().withMessage("Residential Address cannot be empty"),
  body("office_id").optional().isInt().withMessage("Valid Office ID is required"),
];

exports.createUser = [
  upload.single("profile_photo"),
  userValidation,
  validate,
  async (req, res) => {
    try {
      console.log("Raw request body:", req.body);
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is empty or not JSON" });
      }

      const {
        full_name,
        rank_id,
        blood_group,
        last_donated_date,
        mobile_number,
        email,
        password,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      } = req.body;

      console.log("Destructured fields:", {
        full_name,
        rank_id,
        blood_group,
        last_donated_date,
        mobile_number,
        email,
        password,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      });

      if (
        !full_name ||
        !rank_id ||
        !blood_group ||
        !mobile_number ||
        !email ||
        !password ||
        !date_of_birth ||
        !service_start_date ||
        !residential_address ||
        !office_id
      ) {
        return res.status(400).json({ error: "Missing required fields", received: req.body });
      }

      const office = await Office.findByPk(office_id);
      if (!office) {
        return res.status(400).json({ error: "Office ID does not exist" });
      }

      const rank = await Rank.findByPk(rank_id);
      if (!rank) {
        return res.status(400).json({ error: "Rank ID does not exist" });
      }

      const login_id = await generateLoginId();
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        login_id,
        full_name,
        rank_id,
        blood_group,
        last_donated_date,
        mobile_number,
        email,
        password: hashedPassword,
        date_of_birth,
        service_start_date,
        residential_address,
        profile_photo: req.file ? req.file.path : null,
        office_id,
      });

      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user.get({ plain: true });
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: "Email already exists" });
        }
        if (error.fields.login_id) {
          return res.status(400).json({ error: "Login ID already exists" });
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({ error: "Invalid Office ID or Rank ID" });
      }
      res.status(500).json({ error: "Failed to create user", details: error.message });
    }
  },
];

exports.getUsers = [
  query("blood_group").optional().isString(),
  query("office_id").optional().isInt(),
  query("rank_id").optional().isInt(),
  validate,
  async (req, res) => {
    try {
      const { blood_group, office_id, rank_id } = req.query;
      const where = {};
      if (blood_group) where.blood_group = blood_group;
      if (office_id) where.office_id = office_id;
      if (rank_id) where.rank_id = rank_id;

      const users = await User.findAll({
        where,
        include: [
          { model: Office, as: "office", attributes: ["name"] },
          { model: Rank, as: "rank", attributes: ["name"] },
        ],
        order: [["full_name", "ASC"]],
        attributes: { exclude: ["password"] },
      });

      // Map users to flatten office.name and rank.name
      const formattedUsers = users.map((user) => {
        const userData = user.get({ plain: true });
        return {
          ...userData,
          office_name: userData.office ? userData.office.name : null,
          rank_name: userData.rank ? userData.rank.name : null,
          office: undefined,
          rank: undefined,
        };
      });

      res.json(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
  },
];

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Office, as: "office" },
        { model: Rank, as: "rank" },
      ],
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user", details: error.message });
  }
};

exports.updateUser = [
  upload.single("profile_photo"),
  updateUserValidation,
  validate,
  async (req, res) => {
    try {
      console.log("Update request body:", req.body);
      console.log("Update request file:", req.file);

      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const {
        full_name,
        rank_id,
        blood_group,
        last_donated_date,
        mobile_number,
        email,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
        is_active,
      } = req.body;

      // Prepare updates object with only provided fields
      const updates = {};
      if (full_name) updates.full_name = full_name;
      if (rank_id) updates.rank_id = rank_id;
      if (blood_group) updates.blood_group = blood_group;
      if (last_donated_date) updates.last_donated_date = last_donated_date;
      if (mobile_number) updates.mobile_number = mobile_number;
      if (email) updates.email = email;
      if (date_of_birth) updates.date_of_birth = date_of_birth;
      if (service_start_date) updates.service_start_date = service_start_date;
      if (residential_address) updates.residential_address = residential_address;
      if (office_id) updates.office_id = office_id;
      if (is_active !== undefined) updates.is_active = is_active;
      if (req.file) updates.profile_photo = req.file.path;

      // Validate office_id and rank_id if provided
      if (office_id) {
        const office = await Office.findByPk(office_id);
        if (!office) {
          return res.status(400).json({ error: "Office ID does not exist" });
        }
      }
      if (rank_id) {
        const rank = await Rank.findByPk(rank_id);
        if (!rank) {
          return res.status(400).json({ error: "Rank ID does not exist" });
        }
      }

      // Apply updates only if there are changes
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
      }

      await user.update(updates);

      // Fetch updated user with Office and Rank included
      const updatedUser = await User.findByPk(req.params.id, {
        include: [
          { model: Office, as: "office" },
          { model: Rank, as: "rank" },
        ],
        attributes: { exclude: ["password"] },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({ error: "Invalid Office ID or Rank ID" });
      }
      res.status(500).json({ error: "Failed to update user", details: error.message });
    }
  },
];

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user", details: error.message });
  }
};

exports.getOwnProfile = async (req, res) => {
  console.log("req.user.id ======>", req.user.id);

  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Office, as: "office" },
        { model: Rank, as: "rank" },
      ],
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching own profile:", error);
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
};

exports.updateOwnProfile = [
  upload.single("profile_photo"),
  profileUpdateValidation,
  validate,
  async (req, res) => {
    console.log("Update own profile request body:", req.body);
    console.log("Update own profile request file:", req.file);

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const {
        full_name,
        rank_id,
        blood_group,
        last_donated_date,
        mobile_number,
        email,
        date_of_birth,
        service_start_date,
        residential_address,
        office_id,
      } = req.body;

      // Prepare updates object with only provided fields
      const updates = {};
      if (full_name) updates.full_name = full_name;
      if (rank_id) updates.rank_id = rank_id;
      if (blood_group) updates.blood_group = blood_group;
      if (last_donated_date) updates.last_donated_date = last_donated_date;
      if (mobile_number) updates.mobile_number = mobile_number;
      if (email) updates.email = email;
      if (date_of_birth) updates.date_of_birth = date_of_birth;
      if (service_start_date) updates.service_start_date = service_start_date;
      if (residential_address) updates.residential_address = residential_address;
      if (office_id) updates.office_id = office_id;
      if (req.file) updates.profile_photo = req.file.path;

      // Validate office_id and rank_id if provided
      if (office_id) {
        const office = await Office.findByPk(office_id);
        if (!office) {
          return res.status(400).json({ error: "Office ID does not exist" });
        }
      }
      if (rank_id) {
        const rank = await Rank.findByPk(rank_id);
        if (!rank) {
          return res.status(400).json({ error: "Rank ID does not exist" });
        }
      }

      // Apply updates only if there are changes
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
      }

      await user.update(updates);

      // Fetch updated user with Office and Rank included
      const updatedUser = await User.findByPk(req.user.id, {
        include: [
          { model: Office, as: "office" },
          { model: Rank, as: "rank" },
        ],
        attributes: { exclude: ["password"] },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating own profile:", error);
      if (error instanceof UniqueConstraintError) {
        if (error.fields.email) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({ error: "Invalid Office ID or Rank ID" });
      }
      res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
  },
];

exports.changePassword = [
  changePasswordValidation,
  validate,
  async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: { message: "User not found" } });
      }

      const { current_password, new_password } = req.body;

      // Verify current password
      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: { message: "Current password is incorrect" } });
      }

      // Hash new password and update
      const hashedPassword = await bcrypt.hash(new_password, 10);
      await user.update({ password: hashedPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: { message: "Failed to change password", details: error.message } });
    }
  },
];

exports.adminRequestPasswordChange = [
  adminRequestPasswordChangeValidation,
  validate,
  async (req, res) => {
    try {
      const { user_id, email } = req.body;

      // Find user by user_id or email
      const user = await User.findOne({
        where: {
          [Op.or]: [user_id ? { id: user_id } : null, email ? { email } : null].filter(Boolean),
        },
      });

      if (!user) {
        return res.status(404).json({ error: { message: "User not found" } });
      }

      if (!email) {
        return res.status(400).json({ error: { message: "Email is required" } });
      }

      // Generate reset token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000); // 1 hour expiration

      // Store token and expiration
      await user.update({
        reset_password_token: token,
        reset_password_expires: expires,
      });

      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER || "your-email@gmail.com",
        subject: "Password Change Request",
        text: `An admin has requested a password change for your account. Click the link to set a new password: ${resetUrl}\n\nThis link will expire in 1 hour.`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Password change email sent to user" });
    } catch (error) {
      console.error("Error requesting password change:", error);
      res.status(500).json({ error: { message: "Failed to send password change email", details: error.message } });
    }
  },
];
