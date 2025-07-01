import prisma from "../lib/prisma.js";
import {
  createUserSchema,
  loginUserSchema,
  updateUserAvatarSchema,
  updateUserDetailsSchema,
  updateUserPasswordSchema,
} from "../validation/user.schema.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import {
  getFirstJoiErrorMessage,
  isFieldValueTaken,
} from "../utils/commonUtils.js";
import { generateToken } from "../utils/token.js";
import crypto from "crypto";
import cloudinary from "../lib/cloudinary.js";

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
        title: true,
        username: true,
        email: true,
        firstname: true,
        surname: true,
        avatar: true,
        createdAt: true,
        othername: true,
        boi: true,
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

/**
 * Handles user login.
 *
 * Flow:
 * 1. Validates input using Joi.
 * 2. Looks up user by username.
 * 3. If not found, returns 404.
 * 4. Compares password using bcrypt.
 * 5. If match fails, returns 401.
 * 6. Generates token and sends cookie + user response.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    // 1. Validate input
    const { value, error } = loginUserSchema.validate(req.body, {
      abortEarly: true,
    });
    if (error) {
      return res.status(400).json({ message: getFirstJoiErrorMessage(error) });
    }

    // 2. Find user by username
    const user = await prisma.user.findUnique({
      where: { username: value.username },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // 3. Compare password
    const isMatch = await comparePassword(value.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4. Generate token
    const token = generateToken(user.id);

    // 5. Send cookie and user
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        id: user.id,
        title: user.title,
        username: user.username,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        othername: user.othername,
        boi: user.boi,
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Handles user logout.
 *
 * Flow:
 * 1. Clears the `token` cookie from the browser.
 * 2. Returns a success message.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .status(200)
    .json({ message: "Logged out successfully." });
};

/**
 * Updates a user's basic details (excluding password/avatar).
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateUserDetails = async (req, res) => {
  const userId = req.user?.id;

  const { value, error } = updateUserDetailsSchema.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    return res.status(400).json({ message: getFirstJoiErrorMessage(error) });
  }

  // Fetch current user
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  });

  // Check if new email is different before checking for conflict
  if (value.email && value.email !== currentUser.email) {
    const emailTaken = await isFieldValueTaken(
      prisma,
      "user",
      "email",
      value.email,
      userId
    );
    if (emailTaken) {
      return res.status(409).json({ message: "Email is already in use." });
    }
  }

  // Check if new username is different before checking for conflict
  if (value.username && value.username !== currentUser.username) {
    const usernameTaken = await isFieldValueTaken(
      prisma,
      "user",
      "username",
      value.username,
      userId
    );
    if (usernameTaken) {
      return res.status(409).json({ message: "Username is already in use." });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: value,
    select: {
      id: true,
      username: true,
      email: true,
      firstname: true,
      surname: true,
      title: true,
      boi: true,
      avatar: true,
      othername: true,
    },
  });

  return res.status(200).json(updated);
};

/**
 * Updates the user's avatar and optional Cloudinary image ID.
 * If old avatar deletion fails, deletes the newly uploaded image to revert.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const updateUserAvatar = async (req, res) => {
  const userId = req.user?.id;

  // 1. Validate
  const { value, error } = updateUserAvatarSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    return res.status(400).json({ message: getFirstJoiErrorMessage(error) });
  }

  try {
    // 2. Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarId: true },
    });

    // 3. Delete old image (if any)
    if (user?.avatarId) {
      try {
        await cloudinary.uploader.destroy(user.avatarId);
      } catch (deleteErr) {
        // ⚠️ Rollback: delete the new image just uploaded
        if (value.avatarId) {
          try {
            await cloudinary.uploader.destroy(value.avatarId);
          } catch (rollbackErr) {
            console.error("Rollback failed:", rollbackErr.message);
          }
        }

        console.error("Failed to delete old avatar:", deleteErr.message);
        return res.status(500).json({
          message: "Failed to delete old avatar. Update aborted.",
        });
      }
    }

    // 4. Update in DB
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: value.avatar,
        avatarId: value.avatarId || null,
      },
      select: {
        id: true,
        title: true,
        username: true,
        email: true,
        firstname: true,
        surname: true,
        avatar: true,
        createdAt: true,
        othername: true,
        boi: true,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update Avatar Error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error while updating avatar." });
  }
};

/**
 * Generates a password reset token and stores it in the database.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const generateResetToken = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove any existing reset token
    await prisma.resetToken.deleteMany({ where: { userId } });

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token to expire in 15 minutes
    const expDate = new Date(Date.now() + 15 * 60 * 1000);

    // Save to database
    await prisma.resetToken.create({
      data: {
        resetToken,
        userId,
        expDate,
      },
    });

    // Set cookie
    res
      .cookie("reset_token", resetToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .status(200)
      .json({ message: "Reset token created successfully." });
  } catch (err) {
    console.error("Reset token error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * Resets user password using token stored in the database.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const resetPassword = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resetTokenFromCookie = req.cookies?.reset_token;

    if (!resetTokenFromCookie) {
      return res.status(403).json({ message: "Reset token is missing." });
    }

    const { value, error } = updateUserPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: getFirstJoiErrorMessage(error) });
    }

    const storedToken = await prisma.resetToken.findFirst({
      where: { userId },
    });

    const now = new Date();

    if (!storedToken) {
      return res.status(403).json({ message: "Reset token not found." });
    }

    if (storedToken.resetToken !== resetTokenFromCookie) {
      return res.status(403).json({ message: "Reset token does not match." });
    }

    if (storedToken.expDate < now) {
      return res.status(403).json({ message: "Reset token has expired." });
    }

    const hashedPassword = await hashPassword(value.password);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.resetToken.delete({ where: { userId } });
    res.clearCookie("reset_token");

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
