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
