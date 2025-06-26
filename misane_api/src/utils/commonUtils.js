export function generateSlug(title) {
  const cleanTitle = cleanInput(title);

  return cleanTitle
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts the first message from a Joi validation error.
 * @param {import("joi").ValidationError} error - Joi error object.
 * @returns {string} - The first error message.
 */
export function getFirstJoiErrorMessage(error) {
  if (!error || !error.details || error.details.length === 0) {
    return "Invalid input.";
  }

  return error.details[0].message;
}

/**
 * Checks if a specific value exists in a Prisma model field.
 * @param {object} prisma - Your Prisma client instance.
 * @param {string} modelName - The model to check (e.g., "user").
 * @param {string} field - The field to search (e.g., "email").
 * @param {string} value - The value to check.
 * @returns {Promise<boolean>} - True if the value exists, false otherwise.
 */
export async function isFieldValueTaken(prisma, modelName, field, value) {
  if (!prisma[modelName]) {
    throw new Error(`Model '${modelName}' does not exist in Prisma client.`);
  }

  const result = await prisma[modelName].findFirst({
    where: {
      [field]: value,
    },
    select: { id: true },
  });

  return !!result;
}
