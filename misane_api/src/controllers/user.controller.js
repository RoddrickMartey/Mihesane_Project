import prisma from "../lib/prisma.lib.js";
import { createUserSchema } from "../validation/user.schema.js";
import { hashPassword } from "../utils/passwordUtils.js";
import {
  getFirstJoiErrorMessage,
  isFieldValueTaken,
} from "../utils/commonUtils.js";
import { generateToken } from "../utils/token.js";

/**
 * Handles user registration (sign up).
 *
 * Flow:
 * 1. Validates the incoming request body using Joi schema.
 * 2. Returns 400 with validation error if input is invalid.
 * 3. Checks if email or username already exists in the database.
 * 4. Returns 409 if either is already taken.
 * 5. Hashes the user’s password using bcrypt.
 * 6. Creates the new user in the database.
 * 7. Generates a token and returns user data.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const signup = async (req, res) => {
  try {
    // 1. Validate input
    const { value, error } = createUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return res.status(400).json({ message: getFirstJoiErrorMessage(error) });
    }

    // 2. Check if email exists
    const emailTaken = await isFieldValueTaken(
      prisma,
      "user",
      "email",
      value.email
    );
    if (emailTaken) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    // 3. Check if username exists
    const usernameTaken = await isFieldValueTaken(
      prisma,
      "user",
      "username",
      value.username
    );
    if (usernameTaken) {
      return res.status(409).json({ message: "Username is already in use." });
    }

    // 4. Hash password
    const hashedPassword = await hashPassword(value.password);

    // 5. Create user
    const newUser = await prisma.user.create({
      data: {
        ...value,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        surname: true,
        avatar: true,
        createdAt: true,
      },
    });

    // 6. Generate token
    const token = generateToken(newUser.id);

    // 7. Return response
    // 7. Set token as a secure HTTP-only cookie and return response
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // send only over HTTPS in production
        sameSite: "Strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json(newUser);
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};
