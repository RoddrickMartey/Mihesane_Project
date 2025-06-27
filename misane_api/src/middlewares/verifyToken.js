import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT from cookie and attach user ID to `req.user`.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware
 */
export function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach user ID to req
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
