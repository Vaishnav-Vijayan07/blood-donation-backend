const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const officeRoutes = require("./routes/office_routes");
const rankRoutes = require("./routes/rank_routes");
const diaryPdfRoutes = require("./routes/diary_pdf_routes");
const Admin = require("./models/admin");
const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config();

const app = express();

// Validate environment variables
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not defined in .env file");
  process.exit(1);
}
if (!process.env.ADMIN_PASSWORD) {
  console.error("Error:  is not defined in .env file");
  process.exit(1);
}

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug middleware to log incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, "Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offices", officeRoutes);
app.use("/api/ranks", rankRoutes);
app.use("/api/diary-pdfs", diaryPdfRoutes);

// Initialize admin user
const initializeAdmin = async () => {
  const adminEmail = "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = await Admin.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Admin.create({
      email: adminEmail,
      password: hashedPassword,
    });
    console.log("Admin user created with email: admin@example.com");
  } else {
    console.log("Admin user already exists with email: admin@example.com");
  }
};

// Database synchronization and server start
sequelize
  .sync({ force: true })
  .then(async () => {
    await initializeAdmin();
    const port = process.env.PORT || 7700;
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
