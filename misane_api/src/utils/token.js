import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for a user.
 *
 * @param {string} userId - The user's unique ID.
 * @param {string} [expiresIn="7d"] - Optional expiration time (e.g., "1d", "7d", "12h").
 * @returns {string} - Signed JWT token.
 */
export function generateToken(userId, expiresIn = "7d") {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Validates a JWT token and returns the decoded payload if valid.
 *
 * @param {string} token - The token to validate.
 * @returns {{ userId: string } | null} - Decoded payload or null if invalid.
 */
export function validateToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null; // or throw err to handle errors externally
  }
}
