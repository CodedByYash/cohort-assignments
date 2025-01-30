const jwt = require("jsonwebtoken");


function middleware(req,res,next){
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Extract `userId` from token payload
        next();
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized: Invalid or expired token" });
    }
}

module.exports = {middleware};