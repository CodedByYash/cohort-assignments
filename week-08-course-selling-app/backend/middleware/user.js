const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  // for cookie based auth
  const token = req.cookies.token;
  // for token
  // const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = {
  userMiddleware,
};
