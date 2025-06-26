import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password.
 * @param {string} password - The raw password.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain password to a hashed one.
 * @param {string} password - Raw password.
 * @param {string} hashed - Hashed password from DB.
 * @returns {Promise<boolean>} - True if they match.
 */
export async function comparePassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}
