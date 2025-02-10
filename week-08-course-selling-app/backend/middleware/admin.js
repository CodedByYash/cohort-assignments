const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  // for cookie based auth
  const token = req.cookies.token;
  // for token
  // const token = req.headers["authorization"];

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = {
  adminMiddleware,
};
