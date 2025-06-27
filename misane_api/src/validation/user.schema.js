import Joi from "joi";

export const createUserSchema = Joi.object({
  title: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Title must not exceed 100 characters.",
  }),
  boi: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Bio must not exceed 500 characters.",
  }),
  firstname: Joi.string().min(2).max(50).required().messages({
    "string.base": "First name must be a string.",
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name must not exceed 50 characters.",
    "any.required": "First name is required.",
  }),
  surname: Joi.string().min(2).max(50).required().messages({
    "string.base": "Surname must be a string.",
    "string.min": "Surname must be at least 2 characters.",
    "string.max": "Surname must not exceed 50 characters.",
    "any.required": "Surname is required.",
  }),
  othername: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Other name must not exceed 50 characters.",
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username must be a string.",
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters.",
    "string.max": "Username must not exceed 30 characters.",
    "any.required": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must not exceed 100 characters.",
    "any.required": "Password is required.",
  }),
  avatar: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Avatar must be a valid image URL.",
  }),
  avatarId: Joi.string().optional().allow(""),
});

export const updateUserDetailsSchema = Joi.object({
  title: Joi.string().max(100).optional().allow("").messages({
    "string.max": "Title must not exceed 100 characters.",
  }),
  boi: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Bio must not exceed 500 characters.",
  }),
  firstname: Joi.string().min(2).max(50).optional().messages({
    "string.min": "First name must be at least 2 characters.",
    "string.max": "First name must not exceed 50 characters.",
  }),
  surname: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Surname must be at least 2 characters.",
    "string.max": "Surname must not exceed 50 characters.",
  }),
  othername: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Other name must not exceed 50 characters.",
  }),
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.min": "Username must be at least 3 characters.",
    "string.max": "Username must not exceed 30 characters.",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),
})
  .or("title", "boi", "firstname", "surname", "othername", "username", "email")
  .messages({
    "object.missing": "At least one field must be provided to update.",
  });

export const updateUserAvatarSchema = Joi.object({
  avatar: Joi.string().uri().required().messages({
    "string.uri": "Avatar must be a valid URL.",
    "any.required": "Avatar is required.",
  }),
  avatarId: Joi.string().optional().allow(""),
});

export const updateUserPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Password must be at least 6 characters.",
    "string.max": "Password must not exceed 100 characters.",
    "any.required": "Password is required.",
  }),
});

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username must be a string.",
    "string.alphanum": "Username can only contain letters and numbers.",
    "string.empty": "Username is required.",
    "string.min": "Username must be at least {#limit} characters.",
    "string.max": "Username must not exceed {#limit} characters.",
    "any.required": "Username is required.",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password is required.",
    "string.min": "Password must be at least {#limit} characters.",
    "string.max": "Password must not exceed {#limit} characters.",
    "any.required": "Password is required.",
  }),
});
