const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  const token = req.header["authorization"];
  const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({ message: "You are not signed in" });
  }
}

module.exports = {
  userMiddleware,
};
