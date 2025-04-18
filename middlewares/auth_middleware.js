const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    
    if (decoded.type !== "admin") {
      return res.status(403).json({ error: "Requires admin role" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { requireAuth, requireAdmin };
console.log("auth_middleware exports:", Object.keys(module.exports));
