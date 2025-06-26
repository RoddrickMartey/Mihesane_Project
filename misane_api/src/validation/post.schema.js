import Joi from "joi";

export const sectionSchema = Joi.object({
  type: Joi.string()
    .valid(
      "subtitle",
      "paragraph",
      "image",
      "paragraphWithImage",
      "quote",
      "code"
    )
    .required()
    .messages({
      "any.required": "Each section must have a type.",
      "any.only":
        "Section type must be one of: subtitle, paragraph, image, paragraphWithImage, quote, code.",
    }),

  text: Joi.when("type", {
    is: Joi.valid("subtitle", "paragraph", "paragraphWithImage", "quote"),
    then: Joi.string().min(1).required().messages({
      "string.base": "Text must be a string.",
      "string.empty": "Text cannot be empty.",
      "any.required": "Text is required for this section.",
    }),
    otherwise: Joi.forbidden(),
  }),

  image: Joi.when("type", {
    is: "paragraphWithImage",
    then: Joi.string().uri().required().messages({
      "string.uri": "Image must be a valid URL.",
      "any.required": "Image URL is required for paragraphWithImage.",
    }),
    otherwise: Joi.forbidden(),
  }),

  url: Joi.when("type", {
    is: "image",
    then: Joi.string().uri().required().messages({
      "string.uri": "URL must be a valid image link.",
      "any.required": "Image URL is required for image sections.",
    }),
    otherwise: Joi.forbidden(),
  }),

  caption: Joi.when("type", {
    is: "image",
    then: Joi.string().optional().messages({
      "string.base": "Caption must be a string.",
    }),
    otherwise: Joi.forbidden(),
  }),

  align: Joi.when("type", {
    is: "paragraphWithImage",
    then: Joi.string().valid("left", "right").required().messages({
      "any.only": "Align must be either 'left' or 'right'.",
      "any.required": "Alignment is required for paragraphWithImage.",
    }),
    otherwise: Joi.forbidden(),
  }),

  author: Joi.when("type", {
    is: "quote",
    then: Joi.string().optional().messages({
      "string.base": "Author must be a string.",
    }),
    otherwise: Joi.forbidden(),
  }),

  language: Joi.when("type", {
    is: "code",
    then: Joi.string().required().messages({
      "string.base": "Language must be a string.",
      "any.required": "Language is required for code sections.",
    }),
    otherwise: Joi.forbidden(),
  }),

  code: Joi.when("type", {
    is: "code",
    then: Joi.string().required().messages({
      "string.base": "Code must be a string.",
      "any.required": "Code is required for code sections.",
    }),
    otherwise: Joi.forbidden(),
  }),
});

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least {#limit} characters.",
    "string.max": "Title must not exceed {#limit} characters.",
    "any.required": "Title is required.",
  }),

  image: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Post image must be a valid URL.",
  }),

  authorId: Joi.string().required().messages({
    "string.base": "Author ID must be a string.",
    "any.required": "Author ID is required.",
  }),

  sections: Joi.array().items(sectionSchema).min(1).required().messages({
    "array.base": "Sections must be an array.",
    "array.min": "At least one section is required.",
    "any.required": "Sections are required.",
  }),
  category: Joi.string()
    .valid(
      "Technology",
      "Health",
      "Education",
      "Travel",
      "Food",
      "Business",
      "Lifestyle",
      "Entertainment",
      "Science",
      "Sports"
    )
    .required()
    .messages({
      "any.required": "Category is required.",
      "any.only": "Invalid category selected.",
    }),
  tags: Joi.array()
    .items(
      Joi.string()
        .trim()
        .lowercase()
        .min(1)
        .max(30)
        .pattern(/^[a-zA-Z0-9-_]+$/)
        .messages({
          "string.pattern.base":
            "Tags can only contain letters, numbers, dashes, and underscores.",
          "string.min": "Tags must be at least 1 character.",
          "string.max": "Tags must not exceed 30 characters.",
        })
    )
    .max(10)
    .required()
    .messages({
      "array.base": "Tags must be an array.",
      "array.max": "You can add up to 10 tags.",
      "any.required": "Tags are required.",
    }),
});

export const updatePostTitleSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least {#limit} characters.",
    "string.max": "Title must not exceed {#limit} characters.",
    "any.required": "Title is required.",
  }),
});

export const updatePostSectionsSchema = Joi.object({
  sections: Joi.array().items(sectionSchema).min(1).required().messages({
    "array.base": "Sections must be an array.",
    "array.min": "At least one section is required.",
    "any.required": "Sections are required.",
  }),
});

export const updatePostImageSchema = Joi.object({
  image: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Post image must be a valid URL.",
  }),
});

// 4. Tags
export const updatePostTagsSchema = Joi.object({
  tags: Joi.array()
    .items(
      Joi.string()
        .min(1)
        .max(30)
        .pattern(/^[a-zA-Z0-9-_]+$/)
        .messages({
          "string.pattern.base":
            "Tags can only contain letters, numbers, dashes, and underscores.",
          "string.min": "Tags must be at least 1 character.",
          "string.max": "Tags must not exceed 30 characters.",
        })
    )
    .max(10)
    .required()
    .messages({
      "array.base": "Tags must be an array.",
      "array.max": "You can add up to 10 tags.",
      "any.required": "Tags are required.",
    }),
});

// 5. Category
export const updatePostCategorySchema = Joi.object({
  category: Joi.string()
    .valid(
      "Technology",
      "Health",
      "Education",
      "Travel",
      "Food",
      "Business",
      "Lifestyle",
      "Entertainment",
      "Science",
      "Sports"
    )
    .required()
    .messages({
      "any.required": "Category is required.",
      "any.only": "Invalid category selected.",
    }),
});
